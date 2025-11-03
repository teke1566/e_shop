package com.eshop.order_service.jackson;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.math.BigDecimal;

public class MoneyDeserializer extends JsonDeserializer<BigDecimal> {
    @Override
    public BigDecimal deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        if (p.getCurrentToken().isNumeric()) {
            return p.getDecimalValue();
        }
        String s = p.getValueAsString();
        if (s == null) return BigDecimal.ZERO;
        s = s.trim();
        if (s.equalsIgnoreCase("free")) return BigDecimal.ZERO;
        s = s.replace("$", "").replace(",", "");
        try { return new BigDecimal(s); } catch (NumberFormatException e) { return BigDecimal.ZERO; }
    }
}
