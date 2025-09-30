# 🔔 Sistema de Notificações Push

Este documento descreve o sistema de notificações push implementado no Appicultor para alertas de visitas.

## 📋 Visão Geral

O sistema de notificações foi implementado usando **expo-notifications** e permite:

- ✅ Notificações push locais e remotas
- ✅ Agendamento de lembretes de visitas
- ✅ Notificações instantâneas ao cadastrar relatórios
- ✅ Configuração de notificações por visita
- ✅ Gestão de permissões de notificação

## 🚀 Funcionalidades Implementadas

### 1. Permissões de Notificação

O aplicativo solicita permissões de notificação automaticamente ao iniciar:

```typescript
// Em App.tsx
registerForPushNotificationsAsync().then(token => {
  setExpoPushToken(token);
  console.log('Expo Push Token:', token);
});
```

### 2. Notificação Imediata ao Cadastrar Relatório

Quando um relatório de visita é cadastrado com sucesso, o usuário recebe uma notificação instantânea:

```typescript
await sendImmediateNotification(
  '✅ Relatório Cadastrado',
  `Relatório de visita ao apiário ${localizacao} foi cadastrado com sucesso!`
);
```

### 3. Lembrete de Visita

Se a data da visita for futura e o usuário optar por receber notificações, um lembrete é agendado 24 horas antes:

```typescript
await scheduleVisitReminder(
  apiaryName,
  visitDate,
  24 // Horas antes da visita
);
```

### 4. Configuração por Visita

Na tela de cadastro de relatório, o usuário pode escolher se deseja receber lembretes:

- **Checkbox "Enviar Notificação de Lembrete"**
- Opções: Sim/Não
- Texto explicativo: "Receba um lembrete 24 horas antes da próxima visita"

## 📁 Arquivos Modificados/Criados

### Novos Arquivos

#### `src/utils/notifications.ts`

Serviço utilitário com todas as funções relacionadas a notificações:

**Funções Principais:**

- `registerForPushNotificationsAsync()` - Registra o dispositivo para notificações
- `scheduleVisitNotification()` - Agenda uma notificação para data específica
- `scheduleVisitReminder()` - Agenda lembrete de visita
- `sendImmediateNotification()` - Envia notificação instantânea
- `cancelScheduledNotification()` - Cancela notificação agendada
- `cancelAllScheduledNotifications()` - Cancela todas as notificações
- `getAllScheduledNotifications()` - Lista notificações agendadas
- `dismissAllNotifications()` - Remove notificações da bandeja

### Arquivos Modificados

#### `App.tsx`

- Importação de expo-notifications
- Registro de listeners de notificação
- Solicitação de permissões no app startup
- Tratamento de notificações recebidas e clicadas

#### `src/screens/cadastro-relatorio.tsx`

- Importação das funções de notificação
- Adição de estado `enviarNotificacao`
- Integração com cadastro de relatório
- UI para configuração de notificações

#### `app.json`

- Adição do plugin `expo-notifications`
- Configuração de ícone e cor das notificações

#### `package.json`

- Dependências adicionadas:
  - `expo-notifications`: ^0.32.11
  - `expo-device`: (versão compatível)

## 🎨 Interface do Usuário

### Tela de Cadastro de Relatório

Antes do botão "Adicionar", foi adicionada uma nova seção:

```
🔔 Enviar Notificação de Lembrete
[ ] Sim  [ ] Não

Receba um lembrete 24 horas antes da próxima visita
```

O checkbox segue o mesmo padrão visual dos outros campos da tela.

## 🔧 Configuração Técnica

### Android

O sistema cria automaticamente um canal de notificação chamado "default" com:
- Importância: MAX
- Cor da luz: #FBBA25 (amarelo do app)
- Padrão de vibração: [0, 250, 250, 250]

### iOS

As notificações usam o sistema padrão do iOS com permissões solicitadas ao usuário.

## 📱 Comportamento das Notificações

### Notificação de Cadastro

- **Título**: "✅ Relatório Cadastrado"
- **Corpo**: "Relatório de visita ao apiário [localização] foi cadastrado com sucesso!"
- **Timing**: Instantâneo

### Notificação de Lembrete

- **Título**: "🐝 Lembrete de Visita ao Apiário"
- **Corpo**: "Você tem uma visita agendada para o [apiário] em 24 horas."
- **Timing**: 24 horas antes da visita agendada

### Listeners

O aplicativo possui listeners para:

1. **Notificações Recebidas**: Log quando notificação chega
2. **Resposta a Notificações**: Log quando usuário toca na notificação

## 🧪 Como Testar

### Em Dispositivo Físico

1. Instalar o app em um dispositivo físico (notificações não funcionam no simulador)
2. Aceitar permissões de notificação quando solicitado
3. Cadastrar um novo relatório de visita
4. Verificar notificação instantânea de confirmação
5. Para testar lembretes, agendar visita para dia seguinte

### Em Desenvolvimento

```bash
# Executar no dispositivo
npx expo run:android
# ou
npx expo run:ios
```

## 🔐 Permissões Necessárias

### Android
- `android.permission.VIBRATE` (automático com expo-notifications)
- `android.permission.USE_FULL_SCREEN_INTENT` (automático)

### iOS
- Permissão de notificações (solicitada em runtime)

## 📝 Logs e Debugging

O sistema inclui logs em pontos-chave:

```typescript
console.log('Expo Push Token:', token);
console.log('Notificação recebida:', notification);
console.log('Resposta da notificação:', response);
console.log('Notificação de lembrete agendada');
```

## 🚧 Limitações Conhecidas

1. **Modo Offline**: Notificações instantâneas não são enviadas quando offline (apenas lembretes agendados funcionam)
2. **Simulador**: Push notifications não funcionam em simuladores iOS/Android
3. **Horário**: Lembretes são fixos em 24 horas antes; não há configuração customizável

## 🔄 Melhorias Futuras Possíveis

- [ ] Permitir usuário escolher o horário do lembrete (12h, 24h, 48h)
- [ ] Notificações para situações críticas (ex: mortalidade alta)
- [ ] Lembretes recorrentes para visitas de rotina
- [ ] Notificações push remotas via servidor
- [ ] Estatísticas de notificações (entregues, abertas, ignoradas)
- [ ] Som customizado para notificações do app
- [ ] Deep linking para abrir tela específica ao tocar na notificação
- [ ] Notificações em grupo por apiário
- [ ] Cancelar notificações ao editar/excluir visita
- [ ] Histórico de notificações enviadas

## 📚 Recursos Adicionais

- [Documentação Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Guia de Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [Expo Notifications API Reference](https://docs.expo.dev/versions/latest/sdk/notifications/#api)

## 🆘 Troubleshooting

### Notificações não aparecem

1. Verificar se permissões foram concedidas
2. Verificar se está em dispositivo físico (não simulador)
3. Checar logs do console para erros
4. Verificar se o canal de notificação foi criado (Android)

### Token não é gerado

1. Verificar conexão com internet
2. Verificar se `expo-device` está instalado
3. Verificar se está em dispositivo físico

### Notificações não agendam

1. Verificar se a data é futura
2. Checar logs para mensagens de erro
3. Verificar permissões de notificação

---

**Implementado em**: Dezembro 2024  
**Versão do expo-notifications**: 0.32.11  
**Compatibilidade**: Expo SDK 51
