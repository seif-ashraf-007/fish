import CardRoter from "./modules/Card/card.router.js"
import UserRouter from "./modules/user/user.router.js"


export const bootstrap=(app)=>{
    app.use('/api/user', UserRouter)
    app.use('/api/card', CardRoter)
}