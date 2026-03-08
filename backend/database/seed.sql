INSERT INTO companies (name) VALUES ('OmniFlow F&B');

INSERT INTO outlets (company_id, name, location) VALUES
  (1, 'Downtown', '123 Main St'),
  (1, 'Mall Outlet', 'City Mall L2'),
  (1, 'Airport', 'Terminal 1');

INSERT INTO menu_items (name, base_price) VALUES
  ('Chicken Burger', 8.50),
  ('Beef Burger', 10.00),
  ('Fries', 4.50),
  ('Cola', 2.50),
  ('Iced Tea', 3.00),
  ('Chicken Wrap', 7.50),
  ('Caesar Salad', 6.00),
  ('Choco Shake', 5.50);

INSERT INTO outlet_menu_items (outlet_id, menu_item_id, override_price) VALUES
  (1, 1, NULL), (1, 2, NULL), (1, 3, NULL), (1, 4, NULL), (1, 5, NULL),
  (2, 1, 9.00), (2, 2, 11.00), (2, 3, 5.00), (2, 4, 3.00),
  (3, 1, 10.00), (3, 6, 8.50), (3, 8, 6.50);

INSERT INTO inventory (outlet_id, menu_item_id, stock) VALUES
  (1, 1, 50), (1, 2, 40), (1, 3, 100), (1, 4, 200), (1, 5, 150),
  (2, 1, 30), (2, 2, 20), (2, 3, 80), (2, 4, 120),
  (3, 1, 20), (3, 6, 25), (3, 8, 15);