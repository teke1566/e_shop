package com.eshop.order_service.exception;

import com.eshop.order_service.response.ErrorDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorDetail> handleCustomException(CustomException ex) {
        ErrorDetail errorDetail = new ErrorDetail();
        errorDetail.setErrorMessage(ex.getMessage());
        errorDetail.setErrorCode(ex.getErrorCode());
        return ResponseEntity.status(ex.getStatusCode()).body(errorDetail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetail> handleGeneralException(Exception ex) {
        ErrorDetail errorDetail = new ErrorDetail();
        errorDetail.setErrorMessage("An unexpected error occurred");
        errorDetail.setErrorCode("INTERNAL_SERVER_ERROR");
        return ResponseEntity.status(500).body(errorDetail);
    }
}
