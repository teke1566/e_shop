package com.eshop.order_service.external.decoder;

import com.eshop.order_service.exception.CustomException;
import com.eshop.order_service.response.ErrorDetail;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import feign.codec.ErrorDecoder;

import java.io.IOException;

public class CustomErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String s, Response response) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            ErrorDetail errorDetail = objectMapper
                    .readValue(response.body().asInputStream(), ErrorDetail.class);
            return new CustomException(
                    errorDetail.getErrorMessage(),
                    errorDetail.getErrorCode(),
                    response.status());
        } catch (IOException e) {
            throw new CustomException("Internal server error",
                    "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
