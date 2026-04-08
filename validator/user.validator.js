// this will include all the validations related to the user.

import { UserAuthenticationSchemaValidator } from "../Schemavalidator/auth.validatior.js";
import { userSchemaValidator } from "../Schemavalidator/user.validator.js";

class UserValidator{
   static ValidateCreateUser(req,res,next){
     const {isValid,errors,sanitizedData} = userSchemaValidator(req.body);
     if(!isValid){
       return res.status(404).json({ errors });
     }
     req.body = sanitizedData;
     next();
   }

   static ValidateAuthUser(req,res,next){
    const {isValid,errors,sanitizedData} = UserAuthenticationSchemaValidator(req.body);
     if(!isValid){
      return res.status(404).json({errors});
     }
     req.body = sanitizedData
     next();
   }

}
export default UserValidator;