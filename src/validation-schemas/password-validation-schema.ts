import * as Yup from "yup";

export const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .required("Auth.PasswordIsRequired")
    .min(8, "Auth.PasswordMustBeAtLeast8")
    .matches(
      /[A-Z\u0406\u0407\u0410-\u042F]/,
      "Auth.PasswordMustIncludeCapitalLetter"
    )
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/,
      "Auth.PasswordMustIncludeSpecialSymbol"
    ),
  passwordConfirmation: Yup.string()
    .required("Auth.ConfirmPasswordRequired")
    .oneOf([Yup.ref("password")], "Auth.PwsDNM"),
});