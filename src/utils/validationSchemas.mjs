// Validation Schema for Create User
export const createUserValidationSchema = {
    // Validation for user_name field
    user_name :{
        // Check if the user_name field is not empty
        notEmpty :{
            errorMessage: "User Name Must Not Be Empty"
        },
        // Check if the user_name field is a string and has a length between 3 and 12 characters
        isLength :{
            options:{min:3, max:12},
            errorMessage : "User name must be between 3 and 12 characters"
        },
        // Check if the user_name field is a string
        isString :{
            errorMessage : "User name must be a string"
        }
    },
    // Validation for age field
    age:{
        notEmpty :{
            errorMessage: "User Name Must Not Be Empty"
        }
    }
}