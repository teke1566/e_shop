package com.eshop.product.exception;

public class ProductServiceException extends RuntimeException{
    private String statusCode;

    public ProductServiceException(String message, String statusCode) {
        super(message);
        this.statusCode=statusCode;
    }
    public String getStatusCode(){
        return statusCode;
        
    }
    public void setStatusCode(String statusCode){
        this.statusCode=statusCode;
    }
}
