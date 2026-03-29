export const translations = {
    en: {
        newChat: "New chat",
        about: "About",
        settings: "Settings",
        guestUser: "Guest User",
        welcomeMessage: "How can I help you today?",
        placeholder: "Ask for a risk score of 0x... or analyze a smart contract pattern...",
        disclaimer: "OpenKYT can make mistakes. Consider verifying important information.",
        aboutTitle: "About OpenKYT",
        aboutText: `OpenKYT is the implementation of the **StableAML** research paper. It is built on the foundations of **OpenAML**, a project originating from the **DTCC AI Hackathon** and supported by **FINOS** and **Duke University**.

**Datasets:**
The system operates on a stack containing 5 years of Ethereum transaction history and a forensic database:
* **80.10 Million** identified contracts.
* **42.07 Million** address labels.
* **1.14 Million** decoded EVM function signatures.
* **413k+** monitored blacklisted addresses.
* **50k+** smart contract templates.

**Technical Specifications:**
The Risk API utilizes the **StableAML** framework. Using domain-informed tree ensembles, the model reaches a **Macro-F1 score of 0.997**. The architecture differentiates between high-velocity transaction patterns of cybercrime syndicates and the static footprints of sanctioned entities, designed to meet the requirements of **MiCA** (EU) and the **GENIUS Act** (U.S.).

**Technical Stack & Specifications**

| Machine Learning | Data & Storage | 
| :--- | :--- |
| NVIDIA L4 GPU | ClickHouse Vector DB | 
| Custom 8B Model | Real-time Indexing | 
| Ollama Engine | 42M+ Labeled Nodes | 


**Source Code:** [github.com/juv1nsk1/OpenKYT](https://github.com/juv1nsk1/OpenKYT)

**Research Paper:** [StableAML (arXiv:2602.17842J)](https://ui.adsabs.harvard.edu/abs/2026arXiv260217842J/abstract)

**Contact:** [ljs65@duke.edu](mailto:ljs65@duke.edu)`,
        version: "Version 1.0.0",
        themeEdition: "Dark Theme Edition",
        settingsTitle: "Settings",
        languageLabel: "Language",
        connecting: "Connecting...",
        error: "Failed to connect to the server. Please check if the Glacier server is accessible.",
        waitlist: "Early Access: 14B Model",
        waitlistTitle: "Unlock Forensic Intelligence at Scale",
        waitlistText: "Sign up for the waitlist to be the first to try the 14B model."
    },
    pt: {
        newChat: "Novo chat",
        about: "Sobre",
        settings: "Configurações",
        guestUser: "Usuário Convidado",
        welcomeMessage: "Como posso ajudar hoje?",
        placeholder: "Peça o score de risco de 0x... ou analise o padrão de um contrato...",
        disclaimer: "O OpenKYT pode cometer erros. Verifique informações importantes.",
        aboutTitle: "Sobre o OpenKYT",
        aboutText: `O OpenKYT é a implementação do paper de pesquisa **StableAML**. É construído sobre os fundamentos do **OpenAML**, projeto originado no **DTCC AI Hackathon** e apoiado pela **FINOS** e **Duke University**.

**Conjuntos de Dados:**
O sistema opera sobre uma infraestrutura contendo 5 anos de histórico de transações Ethereum e uma base de dados forense:
* **80.10 Milhões** de contratos identificados.
* **42.07 Milhões** de rótulos de endereços.
* **1.14 Milhão** de assinaturas de funções EVM decodificadas.
* **413k+** endereços bloqueados monitorados em tempo real.
* **50k+** templates de contratos inteligentes.

**Especificações Técnicas:**
A API de Risco utiliza o framework **StableAML**. Através de ensembles de árvores informados pelo domínio, o modelo atinge um **Macro-F1 score de 0.997**. A arquitetura diferencia padrões de transação de alta velocidade de grupos cibercriminosos de pegadas estáticas de entidades sancionadas, projetada para atender aos requisitos do **MiCA** (UE) e do **GENIUS Act** (EUA).

**Código Fonte:** [github.com/juv1nsk1/OpenKYT](https://github.com/juv1nsk1/OpenKYT)

**Artigo Científico:** [StableAML (arXiv:2602.17842J)](https://ui.adsabs.harvard.edu/abs/2026arXiv260217842J/abstract)

**Contato:** [ljs65@duke.edu](mailto:ljs65@duke.edu)`,
        version: "Versão 1.0.0",
        themeEdition: "Edição Tema Escuro",
        settingsTitle: "Configurações",
        languageLabel: "Idioma",
        connecting: "Conectando...",
        error: "Falha ao conectar ao servidor. Verifique se o servidor Glacier está acessível.",
        waitlist: "Lista de Espera: 14B Model",
        waitlistTitle: "Acesse o 14B Model",
        waitlistText: "Insira seu e-mail para se inscrever na lista de espera."
    },
    es: {
        newChat: "Nuevo chat",
        about: "Acerca de",
        settings: "Configuración",
        guestUser: "Usuario Invitado",
        welcomeMessage: "¿Cómo puedo ayudarte hoy?",
        placeholder: "Pida el score de riesgo de 0x... o analice el patrón de un contrato...",
        disclaimer: "OpenKYT puede cometer errores. Considera verificar la información importante.",
        aboutTitle: "Acerca de OpenKYT",
        aboutText: `OpenKYT es la implementación del artículo de investigación **StableAML**. Está construido sobre las bases de **OpenAML**, un proyecto originado en el **DTCC AI Hackathon** y respaldado por **FINOS** y **Duke University**.

**Conjuntos de Datos:**
El sistema opera sobre una infraestructura que contiene 5 años de historial de transacciones de Ethereum y una base de datos forense:
* **80.10 Millones** de contratos identificados.
* **42.07 Millones** de etiquetas de direcciones.
* **1.14 Millones** de firmas de funciones EVM decodificadas.
* **413k+** direcciones bloqueadas monitoreadas en tiempo real.
* **50k+** plantillas de contratos inteligentes.

**Especificaciones Técnicas:**
La API de Riesgo utiliza el marco **StableAML**. Mediante ensambles de árboles informados por el dominio, el modelo alcanza un **Macro-F1 score de 0.997**. La arquitectura diferencia entre patrones de transacciones de alta velocidad de grupos cibercriminales y las huellas estáticas de entidades sancionadas, diseñada para cumplir con los requisitos de **MiCA** (UE) y el **GENIUS Act** (EE. UU.).

**Código Fuente:** [github.com/juv1nsk1/OpenKYT](https://github.com/juv1nsk1/OpenKYT)

**Artículo Científico:** [StableAML (arXiv:2602.17842J)](https://ui.adsabs.harvard.edu/abs/2026arXiv260217842J/abstract)

**Contacto:** [ljs65@duke.edu](mailto:ljs65@duke.edu)`,
        version: "Versión 1.0.0",
        themeEdition: "Edición Tema Oscuro",
        settingsTitle: "Configuración",
        languageLabel: "Idioma",
        connecting: "Conectando...",
        error: "Error al conectar con el servidor. Compruebe si el servidor Glacier es accesible.",
        waitlist: "Lista de Espera: 14B Model",
        waitlistTitle: "Acceda al 14B Model",
        waitlistText: "Ingrese su correo electrónico para inscribirse a la lista de espera."
    }
};