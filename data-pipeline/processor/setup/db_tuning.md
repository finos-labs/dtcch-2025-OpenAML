[mysqld]
# InnoDB settings
innodb_buffer_pool_size = 4G
innodb_log_file_size = 512M
innodb_log_buffer_size = 64M

# Query cache settings (if using MySQL < 8.0)
query_cache_size = 128M
query_cache_type = 1

# Temporary table settings
tmp_table_size = 256M
max_heap_table_size = 256M

# MyISAM settings
key_buffer_size = 256M

# Other settings
max_connections = 500
table_open_cache = 1024
thread_cache_size = 50


