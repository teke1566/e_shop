package com.eshop.category.exception;

import com.eshop.category.payload.ErrorDetail;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CategoryServiceException.class)
    public ResponseEntity<ErrorDetail> handleDomain(CategoryServiceException ex) {
        ErrorDetail error = new ErrorDetail(
                Instant.now(), HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDetail> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining("; "));
        ErrorDetail error = new ErrorDetail(
                Instant.now(), HttpStatus.BAD_REQUEST.value(), "Validation Failed", msg, null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorDetail> handleConstraint(DataIntegrityViolationException ex) {
        ErrorDetail error = new ErrorDetail(
                Instant.now(), HttpStatus.CONFLICT.value(), "Constraint Violation", ex.getMostSpecificCause().getMessage(), null);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetail> handleGeneric(Exception ex) {
        ErrorDetail error = new ErrorDetail(
                Instant.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Error", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
