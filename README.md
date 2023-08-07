# **Controle de projetos - KenzieVelopers**

## **Introdução**

Uma startup de tecnologia e desenvolvimento web decidiu criar uma API Rest para gerenciar seus desenvolvedores e projetos. Como você é um dos novos integrantes da equipe, você foi o escolhido para desenvolver essa aplicação.

Através dessa API deve ser possível realizar o registro do desenvolvedor, associar informações extras ao mesmo e registrar os projetos de cada desenvolvedor.

A seguir estarão todas as regras de negócio definidas pela startup para esse projeto. Lembre-se de seguir à risca todas as regras impostas.

Vamos lá?!

#

## **Regras da entrega**

A entrega deve seguir as seguintes regras:

- O código deve estar em TypeScript, caso não esteja a **entrega será zerada**;
- Deverá ser utilizado um banco de dados **_postgres_** para a elaboração da API;
- O nome da tabela, das colunas e demais especificações, devem ser seguidas **à risca**. Caso tenha divergência, **será descontado nota**;
- **Tenha muita atenção sobre o nome das chaves nos objetos de entrada e saída de cada requisição**;
- **Na raiz do diretório** deve-se conter uma pasta nomeada **sql**, com dois arquivos:

  - **createTables.sql**: contendo as queries de criação e inserção das tabelas;
  - **diagram.png/jpg**: um arquivo **_.png_** ou **_.jpg_** contendo o diagrama da tabela;
    - caso o arquivo **_createTables.sql_** não exista, **a entrega será zerada**.

**Essa entrega possui testes automatizados**;

- É necessário executar um **npm install** assim que fizer o clone do repositório para que as depedências dos testes sejam instaladas.
- É necessário criar um banco de dados separado para a execução dos testes.
  - Faça a criação do banco de testes e coloque os dados de conexão dele nas variáveis de ambiente que contém o indicador **_TEST_** no nome, assim sua aplicação vai saber em qual banco deve se conectar no momento de executar os testes, evitando inconsistência nos dados.
- Para que os testes possam ser executados, existe um script de limpeza do banco que utiliza as queries do arquivo **createTables.sql** para ser executado, por isso é importante seguir as orientações sobre subdiretório sql e seus arquivos à risca.

  - Caso o subdiretório sql e o arquivo createTables.sql não estejam com os nomes corretos ou no caminho correto os testes falharão, pois não será possível encontrar as queries a serem executadas;
  - Caso o nome de alguma tabela, tipo ou coluna não esteja de acordo com o esperado, os testes também falharão.

- A organização dos demais arquivos e pastas deve seguir o que foi visto previamente.
- Todos os pacotes necessários para desenvolver a aplicação devem ser instalados, já que apenas os pacotes de teste foram incluídos no repositório.

#

## **Tabelas do banco de dados**

### **Tabela developers**

- Nome da tabela: **_developers_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 50 e obrigatório.
  - **email**: string, tamanho 50, obrigatório e único.

### **Tabela developerInfos**

- Nome da tabela: **_developerInfos_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **developerSince**: data e obrigatório.
  - **preferredOS**: OS e obrigatório.
  - **developerId**: inteiro, único, obrigatório e chave estrangeira.
- Especificações:
  - O campo **preferredOS** deve aceitar apenas os valores: Windows, Linux e MacOS.
  - O tipo **OS** deve ser feito usando um **ENUM**.

### **Tabela projects**

- Nome da tabela: **_projects_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 50 e obrigatório.
  - **description**: texto.
  - **repository**: string, tamanho 120 e obrigatório.
  - **startDate**: data e obrigatório.
  - **endDate**: data.
  - **developerId**: inteiro e chave estrangeira.

#

## **Relacionamentos**

### **developers e developerInfos**

- Um desenvolvedor pode ter apenas uma informação adicional, assim como, uma informação adicional pode pertencer a apenas um desenvolvedor.
- Caso o **_developer_** seja deletado, a **_developerInfo_** ligada a ele deve ser **deletada** automaticamente.

### **developers e projects**

- Um desenvolvedor pode ter muitos projetos, porém, um projeto pode pertencer a apenas um desenvolvedor.
- Caso um **_developer_** seja deletado, a coluna **_developerId_** do projeto associado deve ser automaticamente alterada para **NULL**.

#

## **Rotas - /developers**

## Endpoints

| Método | Endpoint              | Responsabilidade                                    |
| ------ | --------------------- | --------------------------------------------------- |
| POST   | /developers           | Cadastrar um novo desenvolvedor                     |
| GET    | /developers/:id       | Listar um desenvolvedor e suas informações          |
| PATCH  | /developers/:id       | Atualizar os dados de um desenvolvedor              |
| DELETE | /developers/:id       | Remover um desenvolvedor                            |
| POST   | /developers/:id/infos | Cadastrar informações adicionais a um desenvolvedor |

#

## Regras da aplicação

### **POST /developers**

- Deve ser possível criar um developer enviando apenas **_name_** e **_email_** através do corpo da requisição;
  - ambos devem ser uma string;
- Não deve ser possível cadastrar um developer enviando um email já cadastrado no banco de dados.

- **Sucesso**:
  - Retorno esperado: um objeto contendo os dados do developer cadastrado
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso o email já cadastrado no banco
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.

- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "email": "ugo@kenzie.com.br",
    "name": "Ugo"
  }
  ```

  - Criando um developer com sucesso:

    | Resposta do servidor:      |
    | -------------------------- |
    | Body: Formato Json         |
    | Status code: _201 CREATED_ |

    ```json
    {
      "id": 1,
      "name": "Ugo",
      "email": "ugo@kenzie.com.br"
    }
    ```

  - Tentando cadastrar com um email existente:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "Email already exists."
    }
    ```

#

### **GET /developers/:id**

- Através do id de um desenvolvedor, deve retornar um objeto contendo dados das seguintes tabelas:

  - **_developers_**;
  - **_developerInfos_**;

- Os dados devem ser retornados exatamente como definidos aqui. Você pode usar apelidos (alias) para realizar essa tarefa:

  - **developerId**: tipo **_number_**;
  - **developerName**: tipo **_string_**;
  - **developerEmail**: tipo **_string_**;
  - **developerInfoDeveloperSince**: tipo **_Date_** ou **_null_**;
  - **developerInfoPreferredOS**: tipo **_string_** ou **_null_**;

- **Sucesso**:
  - Retorno esperado: um objeto contendo os dados mesclados das tabelas **_developers_** e **_developerInfos_**;
  - Status esperado: _200 OK_;
- **Falha**:

  - Caso o id informado não pertença à nenhum developer cadastrado
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

- **Exemplos de retornos**:

  - Listando um developer com sucesso:

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |
    |                       |

    ```json
    {
      "developerId": 1,
      "developerName": "Ugo",
      "developerEmail": "ugo@kenzie.com.br",
      "developerInfoDeveloperSince": null,
      "developerInfoPreferredOS": null
    }
    ```

  - Tentando listar com um id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **PATCH /developers/:id**

- Através do id de um desenvolvedor, deve ser possível atualizar os dados de **_email_** e **_name_**.
- O retorno deverá ser um objeto contendo todos os dados do developer, depois da atualização ter sido realizada.
- **Sucesso**:

  - Retorno esperado: um objeto com os dados atualizados de developer;
  - Status esperado: _200 OK_.

- **Falha**:

  - Caso o id informado não pertence à nenhum developer cadastrado

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

  - Caso o email já esteja cadastrado no banco

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.

- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "email": "ugo.roveda@kenzie.com.br",
    "name": "Ugo Roveda"
  }
  ```

  - Atualizando um developer com sucesso:

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |
    |                       |

    ```json
    {
      "id": 1,
      "email": "ugo.roveda@kenzie.com.br",
      "name": "Ugo Roveda"
    }
    ```

  - Tentando atualizar para um email existente:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "Email already exists."
    }
    ```

  - Tentando listar com um id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **DELETE /developers/:id**

- Deve ser possível deletar um developer informando apenas seu **_id_**;

- **Sucesso**:
  - Retorno esperado: nenhum. Não deve retornar nenhum body;
  - Status esperado: _204 NO CONTENT_
- **Falha**:

  - Caso o id informado não pertença a nenhum developer cadastrado
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

- **Exemplos de retornos**:

  - Deletando um developer com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: nenhum body |
    | Status code: _204 NO CONTENT_ |

    ```json

    ```

  - Tentando deletar com um id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **POST /developers/:id/infos**

- Deve ser possível inserir uma informação adicional a um developer informando seu **_id_**;
- Deve ser possível inserir os dados _developerSince_ e _preferedOS_;

  - _developerSince_ deve ser uma data;
  - _preferredOS_ deve ser apenas um dos três tipos possíveis:
    - Windows
    - Linux
    - MacOS

- **Sucesso**:
  - Retorno esperado: objeto contendo as seguintes chaves:
    - **id**: tipo **_number_**
    - **developerSince**: tipo **_Date_**, formato americano YYYY-MM-DD.
    - **preferredOS**: tipo **_string_**
    - **developerId**: tipo **_number_**
  - Status esperado: _201 CREATED_
- **Falha**:
  - Caso o developer com id informado já contém uma informação adicional:
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.
  - Caso: preferredOS informado não é um dos três permitidos:
    - Body esperado: um objeto contendo a chave message com uma mensagem adequada e uma chave options sendo um array contendo as três opções possíveis;
    - Status esperado: 400 BAD REQUEST.
  - Caso o id informado não pertença a nenhum developer cadastrado
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "developerSince": "2013-01-01",
    "preferredOS": "MacOS"
  }
  ```

  - Criando uma informação adicional com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _201 CREATED_ |

    ```json
    {
      "id": 1,
      "developerSince": "2013-01-01T02:00:00.000Z",
      "preferredOS": "MacOS",
      "developerId": 1
    }
    ```

  - Tentando cadastrar informação à um developer que já possui:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "Developer infos already exists."
    }
    ```

  - Tentando cadastrar informação com um preferredOS inválido:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "message": "Invalid OS option."
    }
    ```

  - Tentando cadastrar informação com um developer id inválido:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

## **Rota - /projects**

## Endpoints

| Método | Endpoint      | Responsabilidade                                      |
| ------ | ------------- | ----------------------------------------------------- |
| POST   | /projects     | Cadastrar um novo projeto                             |
| GET    | /projects/:id | Listar um projeto pelo id e os dados do desenvolvedor |
| PATCH  | /projects/:id | Atualizar um projeto                                  |

## Regras da aplicação

### **POST - /projects**

- Deve ser possível cadastrar um novo projeto enviando os seguintes dados:
  - **name**: tipo **_string_**
  - **description**: tipo **_string_**
  - **repository**: tipo **_string_**
  - **startDate**: tipo **_Date_**, formato americano YYYY-MM-DD.
  - **endDate**: tipo **_Date_**, formato americano YYYY-MM-DD, não obrigatório.
  - **developerId**: tipo **_number_**, não obrigatório.
- No body de retorno, caso o _endDate_ não seja enviado na criação, deve ser retornado um _null_;
- No body de retorno, caso o _developerId_ não seja enviado na criação, deve ser retornado um _null_;

- **Sucesso**:

  - Retorno esperado: objeto contendo todos o dados do projeto criado;
  - Status esperado: _201 CREATED_

- **Falha**:
  - Caso o developerId não pertença a nenhum developer cadastrado
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  // sem endDate e sem developerId
  {
    "name": "Projeto 1",
    "description": "Projeto fullstack",
    "repository": "url.com.br",
    "startDate": "2023-12-02",
  }

  // com endDate e com developerId
  {
    "name": "Projeto 2",
    "description": "Projeto backend",
    "repository": "url.com.br",
    "startDate": "2023-12-10",
    "endDate": "2023-12-23",
    "developerId": 1
  }
  ```

  - Criando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _201 CREATED_ |

    ```json
    // sem endDate e sem developerId no body de envio
    {
      "id": 1,
      "name": "Projeto 1",
      "description": "Projeto fullstack",
      "repository": "url.com.br",
      "startDate": "2023-12-02T03:00:00.000Z",
      "endDate": null,
      "developerId": null
    }

    // com endDate no body de envio
    {
      "id": 2,
      "name": "Projeto 2",
      "description": "Projeto backend",
      "repository": "url.com.br",
      "startDate": "2023-12-10T03:00:00.000Z",
      "endDate": "2023-12-23T03:00:00.000Z",
      "developerId": 1
    }
    ```

  - Tentando criar com um developerId inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **GET - /projects/:id**

- Deve ser possível retornar os dados de um _project_ a partir do _id_ desse projeto;
- O retorno deve ser um de objeto e cada objeto deve retornar os dados da tabela de **_projects_** e o nome do developer vindo da tabela de **_developers_**
- Cada objeto deve conter as seguintes chaves:

  - **projectId**
  - **projectName**
  - **projectDescription**
  - **projectRepository**
  - **projectStartDate**
  - **projectEndDate**
  - **projectDeveloperName**

- **Sucesso**:
  - Retorno esperado: um objeto contendo todos os dados relacionados ao projeto e o nome do desenvolvedor;
  - Status esperado: _200 OK_
- **Falha**:
  - Caso o id não pertença a um project cadastrado
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos de retornos**:

  - Listando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _200 OK_ |

    ```json
        {
            "projectId": 1,
            "projectName": "Projeto 1",
            "projectDescription": "Projeto fullstack",
            "projectRepository": "url.com.br",
            "projectStartDate": "2023-12-02T03:00:00.000Z",
            "projectEndDate": null,
            "projectDeveloperName": "ugo"
        },
    ```

  - Tentando listar com um projectId inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

#

### **PATCH - /projects/:id**

- Deverá ser possível atualizar todos os dados de um projeto com exceção do _id_;
- Todos os dados permitidos para atualização devem ser opcionais no envio;
- **Sucesso**:
  - Retorno esperado: objeto contendo todos os dados do projeto que foi atualizado;
  - Status esperado: _200 OK_
- **Falha**:
  - Caso o id informado na url não pertence à um projeto cadastrado
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
  - Caso o developerId informado no body não pertença à um developer cadastrado
    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "name": "Novo nome",
    "description": "Nova descrição",
    "repository": "novaurl.com.br",
    "startDate": "2022-11-13",
    "endDate": "2023-11-13",
    "developerId": 2
  }
  ```

  - Atualizando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _200 OK_ |

  ```json
  {
    "id": 1,
    "name": "Novo nome",
    "description": "Nova descrição",
    "repository": "novaurl.com.br",
    "startDate": "2022-11-13T03:00:00.000Z",
    "endDate": "2023-11-13T03:00:00.000Z",
    "developerId": 2
  }
  ```

  - Tentando atualizar com um project id inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

  - Tentando atualizar com um developerId inválido:
    | Dados de entrada: |
    | ----------------- |
    | Body: Formato Json |

    ```json
    {
      "developerId": 9999
    }
    ```

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```
