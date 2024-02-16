package com.example.basicapp.Services;

import com.example.basicapp.Dto.ResetCodeDto;

public interface ForgetPasswordService {
   int initiatePasswordReset(String email);


   public boolean verifyResetCode(ResetCodeDto resetCodeDto);
}
