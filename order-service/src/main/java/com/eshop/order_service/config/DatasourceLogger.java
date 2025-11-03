package com.eshop.order_service.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DatasourceLogger {

    private static final Logger log = LoggerFactory.getLogger(DatasourceLogger.class);

    private final DataSource dataSource;

    public DatasourceLogger(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void logDatasource() {
        try (Connection c = dataSource.getConnection()) {
            log.info("ORDER-SERVICE connected to {}", c.getMetaData().getURL());
        } catch (Exception e) {
            log.error("Could not determine datasource URL", e);
        }
    }
}
