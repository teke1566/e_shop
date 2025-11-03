package com.eshop.product.payload;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ErrorDetail {

    private String errorMessage;
    private String errorCode;

    public ErrorDetail(String errorMessage, String errorCode) {
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
}