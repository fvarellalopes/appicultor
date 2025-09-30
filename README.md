# 🐝 Appicultor

<div align="center">
  <img src="./assets/logo-coofamel.png" alt="COOFAMEL Logo" width="400"/>
  
  **Sistema de Gestão de Apiários para Apicultores**
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.74.5-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-~51.0-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.45.0-green.svg)](https://supabase.com/)
</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Modelos de Dados](#-modelos-de-dados)
- [Funcionalidades Offline](#-funcionalidades-offline)
- [Build e Deploy](#-build-e-deploy)
- [Melhorias Futuras](#-melhorias-futuras)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **Appicultor** é um aplicativo móvel desenvolvido para auxiliar apicultores e cooperativas na gestão e monitoramento de apiários. Desenvolvido para a COOFAMEL (Cooperativa de Apicultores), o sistema permite o controle completo de apiários, colmeias e relatórios de visitas técnicas, facilitando a rastreabilidade e o acompanhamento da produção apícola.

### Objetivos Principais

- **Gestão Centralizada**: Controle de múltiplos apiários e colmeias em um único local
- **Rastreabilidade**: Sistema de QR Code para identificação rápida de colmeias
- **Relatórios Detalhados**: Registro de visitas técnicas com informações sobre saúde das colmeias
- **Modo Offline**: Funcionalidade de trabalho sem conexão com sincronização automática
- **Mobilidade**: Acesso às informações em campo através de dispositivos móveis

---

## ✨ Funcionalidades

### 🏠 Gestão de Apiários
- ✅ Cadastro, edição e exclusão de apiários
- ✅ Visualização de localização geográfica
- ✅ Listagem de todas as colmeias por apiário
- ✅ Status de apiários (ativo/inativo)

### 🐝 Gestão de Colmeias
- ✅ Cadastro completo de colmeias com:
  - Quantidade de abelhas
  - Quantidade e tipo de quadros
  - Data de instalação
  - Espécie de abelhas
- ✅ Edição de dados das colmeias
- ✅ Consulta detalhada de informações
- ✅ Geração de QR Code para identificação

### 📊 Relatórios de Visitas Técnicas
- ✅ Registro de visitas com:
  - Data e objetivo da visita
  - Situação do apiário (Boa/Regular/Ruim)
  - Tarefas realizadas
  - Ocorrência de mortalidade
  - Sintomas observados
  - Tratamentos aplicados
  - Conformidade e limpeza
- ✅ Relatórios individuais por colmeia:
  - Situação da colmeia
  - Quadros coletados
  - Observações específicas
- ✅ Consulta de histórico de relatórios
- ✅ Edição de relatórios existentes

### 📱 QR Code
- ✅ Geração de QR Codes para colmeias
- ✅ Leitura de QR Codes para acesso rápido
- ✅ Download de QR Codes para impressão

### 🔄 Modo Offline
- ✅ Cadastro de relatórios sem conexão
- ✅ Armazenamento local com AsyncStorage
- ✅ Sincronização automática ao recuperar conexão
- ✅ Alertas de status de conexão

### 🔔 Notificações Push
- ✅ Sistema de notificações para alertas de visitas
- ✅ Notificação instantânea ao cadastrar relatório
- ✅ Lembretes agendados 24 horas antes de visitas
- ✅ Configuração opcional por visita
- ✅ Gerenciamento de permissões automático

### 👤 Autenticação e Usuários
- ✅ Login seguro com Supabase Auth
- ✅ Gestão de sessão persistente
- ✅ Perfis de produtor e cooperativa
- ✅ Dados vinculados por usuário

---

## 🚀 Tecnologias Utilizadas

### Core Framework
- **[React Native](https://reactnative.dev/)** `0.74.5` - Framework para desenvolvimento móvel
- **[Expo](https://expo.dev/)** `~51.0.31` - Plataforma de desenvolvimento e build
- **[TypeScript](https://www.typescriptlang.org/)** `5.3.3` - Superset JavaScript com tipagem estática

### UI/UX
- **[Tamagui](https://tamagui.dev/)** `1.74.8` - Framework UI moderno e performático
- **[@tamagui/lucide-icons](https://lucide.dev/)** - Biblioteca de ícones
- **[@rneui/themed](https://reactnativeelements.com/)** - Componentes UI adicionais
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** - Gestão de gestos

### Navegação
- **[@react-navigation/native](https://reactnavigation.org/)** `6.1.7` - Navegação principal
- **[@react-navigation/stack](https://reactnavigation.org/docs/stack-navigator/)** - Stack Navigator
- **[@react-navigation/bottom-tabs](https://reactnavigation.org/docs/bottom-tab-navigator/)** - Bottom Tab Navigator

### Backend & Database
- **[Supabase](https://supabase.com/)** `2.45.0` - Backend as a Service
  - Autenticação de usuários
  - Banco de dados PostgreSQL
  - APIs RESTful automáticas
  - Realtime subscriptions

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** `4.5.4` - Gerenciamento de estado leve e eficiente
- **[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)** - Persistência local

### Funcionalidades Específicas
- **[expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)** - Captura de QR Codes
- **[react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg)** - Geração de QR Codes
- **[@react-native-community/netinfo](https://github.com/react-native-netinfo/react-native-netinfo)** - Detecção de conectividade
- **[@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker)** - Seleção de datas
- **[react-native-modal-datetime-picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker)** - Date picker modal
- **[moment](https://momentjs.com/)** - Manipulação de datas
- **[expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** `0.32.11` - Sistema de notificações push
- **[expo-device](https://docs.expo.dev/versions/latest/sdk/device/)** - Informações do dispositivo

### DevOps & Tools
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código
- **[EAS Build](https://docs.expo.dev/build/introduction/)** - Build e deploy

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular e escalável:

```
appicultor/
├── src/
│   ├── @types/          # Definições TypeScript
│   ├── screens/         # Telas do aplicativo
│   ├── navigation/      # Configuração de rotas
│   ├── store/           # Gerenciamento de estado (Zustand)
│   ├── utils/           # Utilitários e helpers
│   └── env/             # Configurações de ambiente
├── assets/              # Imagens e recursos estáticos
└── App.tsx              # Componente raiz
```

### Padrões de Projeto

- **Component-Based Architecture**: Componentes reutilizáveis e isolados
- **Type-Safe**: TypeScript para segurança de tipos
- **State Management**: Zustand para estado global leve
- **Offline-First**: Suporte a funcionalidades offline com sincronização
- **Clean Code**: Código limpo e bem documentado

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Git**
- **Conta Supabase** (para backend)

### Para desenvolvimento nativo:
- **iOS**: macOS com Xcode instalado
- **Android**: Android Studio com Android SDK

---

## 📥 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/fvarellalopes/appicultor.git
cd appicultor
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

---

## ⚙️ Configuração

### 1. Configurar Supabase

Crie um arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Estrutura do Banco de Dados

O projeto utiliza as seguintes tabelas no Supabase:

- **produtores**: Dados dos apicultores
- **apiario**: Informações dos apiários
- **colmeia**: Dados das colmeias
- **relatorio**: Relatórios de visitas técnicas
- **relatorioColmeia**: Relatórios específicos por colmeia

### 3. Configurar EAS (opcional)

Para builds de produção:

```bash
eas login
eas build:configure
```

---

## 🎮 Executando o Projeto

### Modo Desenvolvimento

```bash
# Iniciar o servidor Expo
npm start
# ou
expo start --dev-client
```

### Executar em iOS
```bash
npm run ios
# ou
expo run:ios
```

### Executar em Android
```bash
npm run android
# ou
expo run:android
```

### Web (experimental)
```bash
npm run web
```

---

## 📁 Estrutura de Pastas

```
appicultor/
│
├── src/
│   ├── @types/                    # Tipos TypeScript
│   │   ├── apiario.ts            # Tipo do apiário
│   │   ├── colmeia.ts            # Tipo da colmeia
│   │   ├── relatorio.ts          # Tipo do relatório
│   │   ├── relatorioColmeia.ts   # Tipo do relatório de colmeia
│   │   ├── produtor.ts           # Tipo do produtor
│   │   └── usuario.ts            # Tipo do usuário
│   │
│   ├── screens/                   # Telas do aplicativo
│   │   ├── home.tsx              # Tela inicial
│   │   ├── login.tsx             # Tela de login
│   │   ├── apiarios.tsx          # Lista de apiários
│   │   ├── cadastro-apiario.tsx  # Cadastro de apiário
│   │   ├── editar-apiario.tsx    # Edição de apiário
│   │   ├── consultar-apirario.tsx # Consulta de apiário
│   │   ├── adicionar-colmeias.tsx # Adicionar colmeia
│   │   ├── editar-colmeias.tsx   # Editar colmeia
│   │   ├── consultar-colmeias.tsx # Consultar colmeia
│   │   ├── cadastro-relatorio.tsx # Cadastro de relatório
│   │   ├── editar-relatorio.tsx  # Editar relatório
│   │   ├── consulta-relatorio.tsx # Consulta de relatório
│   │   ├── adicionar-relatorio-colmeia.tsx
│   │   ├── editar-relatorio-colmeia.tsx
│   │   ├── consulta-relatorio-colmeia.tsx
│   │   ├── qr-code.tsx           # Leitor de QR Code
│   │   └── baixar-qr-code.tsx    # Download de QR Code
│   │
│   ├── navigation/                # Configuração de navegação
│   │   ├── index.tsx             # Stack e Tab navigators
│   │   └── tabNavigation.tsx     # Bottom tabs
│   │
│   ├── store/                     # State management (Zustand)
│   │   ├── colmeias.ts           # Store de colmeias
│   │   ├── relatorioColmeias.ts  # Store de relatórios
│   │   └── relatorioColmeiasOffline.ts # Store offline
│   │
│   ├── utils/                     # Utilitários
│   │   └── supabase.ts           # Cliente Supabase
│   │
│   └── env/                       # Configurações
│       └── variaveis.js          # Variáveis de ambiente
│
├── assets/                        # Recursos estáticos
│   ├── icon.png
│   ├── splash.png
│   ├── logo-coofamel.png
│   └── ...
│
├── App.tsx                        # Componente raiz
├── app.json                       # Configuração Expo
├── eas.json                       # Configuração EAS Build
├── package.json                   # Dependências
├── tsconfig.json                  # Configuração TypeScript
├── tamagui.config.ts              # Configuração Tamagui
└── README.md                      # Este arquivo
```

---

## 🗂️ Modelos de Dados

### Apiario
```typescript
type apiario = {
    id: number
    produtor_id: string
    localizacao: string
    colmeias?: colmeia[]
}
```

### Colmeia
```typescript
type colmeia = {
    id?: string
    qtdAbelhas: number
    qtdQuadros: number
    dateInstalacao: Date
    dataInstalacao: string
    especie: string
    apiario_id?: string
    tipoQuadros: string
}
```

### Relatório
```typescript
type relatorio = {
    id: number
    dataVisita: Date
    objVisita: string              // Rotina, Coleta de Mel, Outro
    sitApiario: string             // Boa, Regular, Ruim
    tarRealizadas: string
    mortalidade: boolean
    descSituacao: string
    tratamento: boolean
    descTratamento: string
    limpeza: boolean
    conformidade: boolean
    ocorrenciaSintomas: boolean
    descSintomas: string
    responsavel: string
    colmeiasAfetadas: string
}
```

### Relatório de Colmeia
```typescript
type relatorioColmeia = {
    id?: number
    relatorio_id?: number
    colmeia_id: string
    quaColetados: number           // Quadros coletados
    situacao: string
    index: string
}
```

### Produtor
```typescript
type Produtor = {
    id: number
    nome: string
    municipio: string
    estado: string
}
```

### Usuário
```typescript
type Usuario = {
    id: string
    nome: string
    produtor: boolean
    cooperativa: boolean
    apiario: apiario
    cidade: string
    estado: string
    matricula: number
}
```

---

## 📶 Funcionalidades Offline

O aplicativo possui um robusto sistema de funcionalidades offline:

### Como Funciona

1. **Detecção de Conectividade**: Monitora automaticamente o status da conexão
2. **Armazenamento Local**: Dados salvos no AsyncStorage quando offline
3. **Sincronização Automática**: Ao recuperar conexão, dados são enviados ao servidor
4. **Feedback Visual**: Alertas informam o usuário sobre o status da conexão

### Implementação

```typescript
// Store Zustand para gerenciamento offline
const useRelatorioOfflineStore = create<ColmeiaState>((set, get) => ({
    relatorioColmeiasOffline: [],
    
    // Adiciona relatório offline
    addRelatorioColmeia: async (newRelatorio: string) => {
        // Salva localmente
        await AsyncStorage.setItem('relatorioColmeias', JSON.stringify(data));
    },
    
    // Integra dados quando online
    integraRelatorios: async () => {
        // Envia dados ao Supabase
    }
}));
```

---

## 🔨 Build e Deploy

### Build de Desenvolvimento

```bash
# Build Android
eas build --profile development --platform android

# Build iOS
eas build --profile development --platform ios
```

### Build de Produção

```bash
# Build Android (APK)
eas build --profile production --platform android

# Build iOS
eas build --profile production --platform ios
```

### Configuração de Build (eas.json)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## 🎯 Melhorias Futuras

### Funcionalidades
- [x] Sistema de notificações push para alertas de visitas ✨ **IMPLEMENTADO**
- [ ] Relatórios com gráficos e análises estatísticas
- [ ] Exportação de dados em PDF e Excel
- [ ] Integração com serviços de clima
- [ ] Previsão de colheita baseada em histórico
- [ ] Chat entre cooperativa e produtores
- [ ] Sistema de tarefas e lembretes
- [ ] Galeria de fotos das colmeias
- [ ] Geolocalização automática de apiários
- [ ] Backup automático na nuvem

### Técnicas
- [ ] Implementar testes unitários (Jest)
- [ ] Implementar testes E2E (Detox)
- [ ] Melhorar performance com React.memo
- [ ] Implementar cache de imagens
- [ ] Adicionar CI/CD completo
- [ ] Implementar deep linking
- [ ] Melhorar acessibilidade (a11y)
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Dark mode
- [ ] Versionamento de API

### UX/UI
- [ ] Animações e transições suaves
- [ ] Skeleton screens para carregamento
- [ ] Tutorial inicial (onboarding)
- [ ] Melhorias na experiência do QR Code
- [ ] Design system completo
- [ ] Modo tablet/landscape

### Segurança
- [ ] Autenticação biométrica
- [ ] Criptografia de dados sensíveis
- [ ] Logs de auditoria
- [ ] Rate limiting
- [ ] Validação de dados no frontend

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para type safety
- Siga as convenções do ESLint configurado
- Escreva código limpo e documentado
- Adicione comentários quando necessário
- Mantenha componentes pequenos e reutilizáveis

---

## 📄 Licença

Este projeto é privado e pertence à COOFAMEL (Cooperativa de Apicultores).

---

## 📧 Contato

**Desenvolvedor**: fvarellalopes  
**Repositório**: [github.com/fvarellalopes/appicultor](https://github.com/fvarellalopes/appicultor)

---

## 🙏 Agradecimentos

- **COOFAMEL** - Por viabilizar o projeto
- **Comunidade React Native** - Pelo suporte e recursos
- **Expo Team** - Pela excelente plataforma de desenvolvimento
- **Supabase** - Pelo backend robusto e fácil de usar

---

<div align="center">
  <p>Feito com ❤️ para apicultores</p>
  <p>🐝 Appicultor - Gestão Inteligente de Apiários</p>
</div>
