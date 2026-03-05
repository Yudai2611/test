CREATE TABLE IF NOT EXISTS history_condition
(
    application_id character varying(10) COLLATE pg_catalog."default" NOT NULL,
    history_id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    history_name character varying(75) COLLATE pg_catalog."default",
    saved_by character varying(20) COLLATE pg_catalog."default",
    saved_at timestamp without time zone
);

CREATE TABLE IF NOT EXISTS history_export_condition
(
    application_id character varying(10) COLLATE pg_catalog."default",
    history_id character varying(36) COLLATE pg_catalog."default",
    datasource_id character varying(75) COLLATE pg_catalog."default",
    use_header numeric(1,0),
    file_type character varying(10) COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS history_export_condition_export_field
(
    application_id character varying(10) COLLATE pg_catalog."default",
    history_id character varying(36) COLLATE pg_catalog."default",
    field_id character varying(75) COLLATE pg_catalog."default",
    field_index numeric(3,0),
    use_field numeric(1,0)
);

CREATE TABLE IF NOT EXISTS history_import_condition
(
    application_id character varying(10) COLLATE pg_catalog."default" NOT NULL,
    history_id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    datasource_id character varying(75) COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS history_import_condition_filter_field
(
    application_id character varying(10) COLLATE pg_catalog."default",
    history_id character varying(36) COLLATE pg_catalog."default",
    field_id character varying(75) COLLATE pg_catalog."default",
    group_index numeric(3,0),
    field_index numeric(3,0),
    operator numeric(2,0),
    value character varying(100) COLLATE pg_catalog."default"
);



CREATE TABLE IF NOT EXISTS history_import_condition_import_field
(
    application_id character varying(10) COLLATE pg_catalog."default",
    history_id character varying(36) COLLATE pg_catalog."default",
    field_id character varying(75) COLLATE pg_catalog."default",
    field_index numeric(3,0),
    use_field numeric(1,0)
);

CREATE TABLE IF NOT EXISTS history_import_condition_sort_field
(
    application_id character varying(10) COLLATE pg_catalog."default",
    history_id character varying(36) COLLATE pg_catalog."default",
    field_id character varying(75) COLLATE pg_catalog."default",
    field_index numeric(3,0),
    sort_order character varying(4) COLLATE pg_catalog."default"
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_history_condition
    ON history_condition USING btree
    (application_id COLLATE pg_catalog."default" ASC NULLS LAST, history_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS uk_history_export_condition
    ON history_export_condition USING btree
    (application_id COLLATE pg_catalog."default" ASC NULLS LAST, history_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


CREATE UNIQUE INDEX IF NOT EXISTS uk_history_export_condition_export_field
    ON history_export_condition_export_field USING btree
    (application_id COLLATE pg_catalog."default" ASC NULLS LAST, history_id COLLATE pg_catalog."default" ASC NULLS LAST, field_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS uk_history_import_condition
    ON history_import_condition USING btree
    (application_id COLLATE pg_catalog."default" ASC NULLS LAST, history_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;



CREATE UNIQUE INDEX IF NOT EXISTS uk_history_import_condition_filter_field
    ON history_import_condition_filter_field USING btree
    (application_id COLLATE pg_catalog."default" ASC NULLS LAST, history_id COLLATE pg_catalog."default" ASC NULLS LAST, field_id COLLATE pg_catalog."default" ASC NULLS LAST, group_index ASC NULLS LAST, field_index ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS uk_history_import_condition_import_field
    ON history_import_condition_import_field USING btree
    (application_id COLLATE pg_catalog."default" ASC NULLS LAST, history_id COLLATE pg_catalog."default" ASC NULLS LAST, field_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS uk_history_import_condition_sort_field
    ON history_import_condition_sort_field USING btree
    (application_id COLLATE pg_catalog."default" ASC NULLS LAST, history_id COLLATE pg_catalog."default" ASC NULLS LAST, field_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;