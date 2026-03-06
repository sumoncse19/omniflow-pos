CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE outlets (
  id SERIAL PRIMARY KEY,
  company_id INT NOT NULL REFERENCES companies(id),
  name VARCHAR(100) NOT NULL,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE outlet_menu_items (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  menu_item_id INT NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  override_price NUMERIC(10,2) CHECK (override_price >= 0),
  UNIQUE(outlet_id, menu_item_id)
);

CREATE INDEX idx_outlet_menu ON outlet_menu_items(outlet_id);
