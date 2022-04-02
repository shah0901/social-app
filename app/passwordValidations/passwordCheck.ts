import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class passwordCheck {
  static pwdCheck(control: AbstractControl): ValidationErrors | null {
    return (formgroup: FormGroup) => {
      const pwd = control.get('password')?.value;
      const cnfpwd = control.get('confPassword')?.value;
      console.log(pwd + ' ' + cnfpwd);
      if (pwd !== cnfpwd) {
        return { mustmatch: false };
      }

      return null;
    };
  }
}
