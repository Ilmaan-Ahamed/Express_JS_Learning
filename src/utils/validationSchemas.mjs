export const createUserValidationSchema = {
    user_name :{
        notEmpty :{
            errorMessage: "User Name Must Not Be Empty"
        },
        isLength :{
            options:{min:3, max:12},
            errorMessage : "User name must be between 3 and 12 characters"
        },
        isString :{
            errorMessage : "User name must be a string"
        }
    },


    age:{
        notEmpty :{
            errorMessage: "User Name Must Not Be Empty"
        }
    }
}