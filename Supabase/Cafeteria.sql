-- ============================================
-- SCHEMA
-- ============================================

-- Tabela de Categorias de Produtos
CREATE TABLE categorias (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos (Bebidas, alimentos)
CREATE TABLE produtos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  categoria_id BIGINT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  disponivel BOOLEAN DEFAULT TRUE,
  imagem_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE clientes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  telefone VARCHAR(15),
  cpf VARCHAR(11) UNIQUE,
  endereco TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE pedidos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Pedido
CREATE TABLE itens_pedido (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Funcionários
CREATE TABLE funcionarios (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  telefone VARCHAR(15),
  cargo VARCHAR(50),
  salario DECIMAL(10, 2),
  data_admissao DATE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Avaliações/Reviews
CREATE TABLE avaliacoes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  nota INT CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_pedido_produto ON itens_pedido(produto_id);
CREATE INDEX idx_avaliacoes_produto ON avaliacoes(produto_id);

-- ============================================
-- DADOS (PRODUTOS)
-- ============================================

-- Inserir Categorias
INSERT INTO categorias (nome, descricao) VALUES
('Cafés', 'Bebidas à base de café'),
('Chás', 'Chás e bebidas quentes'),
('Bebidas Frias', 'Refrigerantes, sucos e bebidas geladas'),
('Bolos e Doces', 'Bolos, tortas e sobremesas'),
('Salgados', 'Pães, sanduíches e salgadinhos'),
('Sobremesas', 'Sorvetes, pudins e doces');

-- Inserir Produtos - Cafés
INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel) VALUES
('Espresso', 'Café expresso tradicional 30ml', 5.00, 1, TRUE),
('Cappuccino', 'Espresso com leite vaporizado e espuma', 8.50, 1, TRUE),
('Latte', 'Espresso com leite quente e pouca espuma', 9.00, 1, TRUE),
('Macchiato', 'Espresso com um toque de leite vaporizado', 7.50, 1, TRUE),
('Café com Leite', 'Café coado com leite quente', 6.00, 1, TRUE),
('Café Coado', 'Café coado tradicional 200ml', 4.50, 1, TRUE),
('Mocha', 'Espresso com chocolate e leite vaporizado', 10.00, 1, TRUE),
('Flat White', 'Espresso com leite vaporizado cremoso', 9.50, 1, TRUE);

-- Inserir Produtos - Chás
INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel) VALUES
('Chá Verde', 'Chá verde quente', 5.50, 2, TRUE),
('Chá Preto', 'Chá preto tradicional', 5.50, 2, TRUE),
('Chá de Camomila', 'Camomila relaxante', 5.50, 2, TRUE),
('Chá de Gengibre', 'Gengibre quente com limão', 6.00, 2, TRUE),
('Chai Latte', 'Chá especiado com leite vaporizado', 8.50, 2, TRUE);

-- Inserir Produtos - Bebidas Frias
INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel) VALUES
('Café Gelado', 'Espresso gelado com leite', 7.50, 3, TRUE),
('Iced Latte', 'Latte gelado com gelo', 8.00, 3, TRUE),
('Suco Natural Laranja', 'Suco de laranja espremido', 7.00, 3, TRUE),
('Suco Natural Melancia', 'Suco de melancia refrescante', 7.50, 3, TRUE),
('Refrigerante', 'Refrigerante 350ml', 5.00, 3, TRUE),
('Água de Coco', 'Água de coco gelada', 6.50, 3, TRUE);

-- Inserir Produtos - Bolos e Doces
INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel) VALUES
('Bolo de Chocolate', 'Bolo de chocolate macio com cobertura', 6.50, 4, TRUE),
('Bolo de Cenoura', 'Bolo de cenoura com cobertura de chocolate', 6.00, 4, TRUE),
('Brownie', 'Brownie de chocolate quente', 7.00, 4, TRUE),
('Torta de Morango', 'Torta fresca com morangos', 8.50, 4, TRUE),
('Cheesecake', 'Cheesecake clássico', 9.00, 4, TRUE),
('Pavê', 'Pavê de chocolate e biscoito', 7.50, 4, TRUE);

-- Inserir Produtos - Salgados
INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel) VALUES
('Croissant', 'Croissant de manteiga fresco', 6.50, 5, TRUE),
('Croissant de Chocolate', 'Croissant recheado com chocolate', 7.00, 5, TRUE),
('Pão de Queijo', 'Pão de queijo quente', 5.00, 5, TRUE),
('Sanduíche Natural', 'Sanduíche com frango, alface e tomate', 12.00, 5, TRUE),
('Sanduíche de Atum', 'Sanduíche com atum fresco', 13.00, 5, TRUE),
('Quiche', 'Quiche com queijo e cebola', 8.50, 5, TRUE),
('Coxinha', 'Coxinha de frango crocante', 4.50, 5, TRUE),
('Bolo Salgado', 'Bolo salgado com milho e requeijão', 5.50, 5, TRUE);

-- Inserir Produtos - Sobremesas
INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel) VALUES
('Sorvete Vanilla', 'Sorvete de baunilha cremoso', 6.00, 6, TRUE),
('Sorvete Chocolate', 'Sorvete de chocolate intenso', 6.50, 6, TRUE),
('Sorvete Morango', 'Sorvete de morango natural', 6.50, 6, TRUE),
('Açaí com Granola', 'Açaí cremoso com granola e mel', 12.00, 6, TRUE),
('Pudim de Leite Condensado', 'Pudim clássico com calda de caramelo', 5.50, 6, TRUE),
('Mousse de Chocolate', 'Mousse cremosa de chocolate belga', 7.00, 6, TRUE);
