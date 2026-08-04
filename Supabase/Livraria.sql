-- ============================================
-- SCHEMA
-- ============================================

-- Tabela de Categorias/Gêneros
CREATE TABLE categorias (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Autores
CREATE TABLE autores (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(150) NOT NULL,
  nacionalidade VARCHAR(100),
  biografia TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Editoras
CREATE TABLE editoras (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(150) NOT NULL UNIQUE,
  pais VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Livros
CREATE TABLE livros (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo VARCHAR(200) NOT NULL,
  isbn VARCHAR(13) UNIQUE,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  categoria_id BIGINT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  autor_id BIGINT NOT NULL REFERENCES autores(id) ON DELETE CASCADE,
  editora_id BIGINT NOT NULL REFERENCES editoras(id) ON DELETE CASCADE,
  ano_publicacao INT,
  num_paginas INT,
  estoque INT DEFAULT 0,
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
  livro_id BIGINT NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
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
  livro_id BIGINT NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
  nota INT CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_livros_categoria ON livros(categoria_id);
CREATE INDEX idx_livros_autor ON livros(autor_id);
CREATE INDEX idx_livros_editora ON livros(editora_id);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_pedido_livro ON itens_pedido(livro_id);
CREATE INDEX idx_avaliacoes_livro ON avaliacoes(livro_id);

-- ============================================
-- DADOS
-- ============================================

-- Inserir Categorias
INSERT INTO categorias (nome, descricao) VALUES
('Romance', 'Livros de romance e ficção romântica'),
('Ficção Científica', 'Livros de ficção científica e fantasia'),
('Suspense e Terror', 'Livros de suspense, mistério e terror'),
('Autoajuda', 'Livros de desenvolvimento pessoal'),
('Infantil', 'Livros infantis e juvenis'),
('Biografia', 'Biografias e memórias'),
('Tecnologia', 'Livros de programação e tecnologia'),
('História', 'Livros de história e política');

-- Inserir Editoras
INSERT INTO editoras (nome, pais) VALUES
('Companhia das Letras', 'Brasil'),
('Editora Rocco', 'Brasil'),
('Editora Intrínseca', 'Brasil'),
('Editora Sextante', 'Brasil'),
('Editora Novo Conceito', 'Brasil'),
('Editora Globo', 'Brasil');

-- Inserir Autores
INSERT INTO autores (nome, nacionalidade, biografia) VALUES
('Machado de Assis', 'Brasileira', 'Um dos maiores escritores da literatura brasileira'),
('J.K. Rowling', 'Britânica', 'Autora da saga Harry Potter'),
('George Orwell', 'Britânica', 'Autor de 1984 e A Revolução dos Bichos'),
('Paulo Coelho', 'Brasileira', 'Autor de O Alquimista, best-seller mundial'),
('Agatha Christie', 'Britânica', 'Rainha do romance policial'),
('Stephen King', 'Americana', 'Mestre do terror contemporâneo'),
('Clarice Lispector', 'Brasileira', 'Uma das principais escritoras do modernismo brasileiro'),
('Robert C. Martin', 'Americana', 'Autor de referência em engenharia de software');

-- Inserir Livros
INSERT INTO livros (titulo, isbn, descricao, preco, categoria_id, autor_id, editora_id, ano_publicacao, num_paginas, estoque, disponivel) VALUES
('Dom Casmurro', '9788525406958', 'Clássico da literatura brasileira sobre ciúme e dúvida', 35.90, 1, 1, 1, 1899, 256, 15, TRUE),
('Harry Potter e a Pedra Filosofal', '9788532511010', 'Primeiro livro da saga do bruxo mais famoso do mundo', 45.90, 2, 2, 2, 1997, 264, 20, TRUE),
('1984', '9788535914849', 'Distopia clássica sobre vigilância e totalitarismo', 39.90, 2, 3, 1, 1949, 416, 18, TRUE),
('O Alquimista', '9788532511011', 'A jornada de um pastor em busca de seu tesouro pessoal', 34.90, 4, 4, 4, 1988, 208, 25, TRUE),
('Assassinato no Expresso Oriente', '9788525056030', 'Um dos mistérios mais famosos de Hercule Poirot', 32.90, 3, 5, 2, 1934, 256, 12, TRUE),
('It: A Coisa', '9788560280524', 'Terror clássico sobre um grupo de amigos e uma entidade maligna', 54.90, 3, 6, 3, 1986, 1104, 10, TRUE),
('A Hora da Estrela', '9788520925890', 'Última obra de Clarice Lispector, sobre Macabéa', 29.90, 1, 7, 1, 1977, 96, 14, TRUE),
('Código Limpo', '9788576082675', 'Boas práticas de programação e desenvolvimento de software', 89.90, 7, 8, 6, 2008, 431, 8, TRUE),
('A Revolução dos Bichos', '9788535914856', 'Fábula política sobre uma revolução em uma fazenda', 29.90, 2, 3, 1, 1945, 152, 22, TRUE),
('Harry Potter e a Câmara Secreta', '9788532511027', 'Segundo livro da saga do bruxo Harry Potter', 45.90, 2, 2, 2, 1998, 288, 17, TRUE);
