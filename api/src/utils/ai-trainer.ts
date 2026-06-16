// Deep Training Matrix Generator for NlpManager

export function deepTrain(manager: any) {
  let sentenceCount = 0;

  const add = (text: string, intent: string) => {
    manager.addDocument('en', text.trim().replace(/\s+/g, ' '), intent);
    sentenceCount++;
  };

  // 1. GREETINGS MATRIX
  const greetWords = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'sup', 'yo'];
  const greetFollowups = ['', ' there', ' aura', ' system', ' assistant', ' AI', ' computer'];
  greetWords.forEach(w => greetFollowups.forEach(f => add(`${w}${f}`, 'greetings.hello')));

  const howAreYou = ['how are you', 'how is it going', 'how are things', 'what is up', 'are you doing well'];
  const today = ['', ' today', ' right now', ' this morning', ' currently'];
  howAreYou.forEach(h => today.forEach(t => add(`${h}${t}`, 'greetings.howareyou')));

  // 2. COUNTING MATRIX (Extremely Deep Variations)
  const countVerbs = ['how many', 'count', 'show me total', 'tell me number of', 'fetch total', 'get count of', 'what is the number of', 'calculate total', 'give me all', 'list number of'];
  const countAdjectives = ['', ' active', ' current', ' registered', ' all', ' system', ' enterprise', ' company'];
  
  const entityMap: Record<string, string[]> = {
    'hr.count': ['employees', 'staff', 'workers', 'personnel', 'team members', 'colleagues', 'human resources'],
    'rbac.count': ['users', 'accounts', 'people', 'logins', 'profiles', 'system users'],
    'logistics.count': ['shipments', 'deliveries', 'packages', 'freight', 'cargo', 'dispatch', 'trucks in transit', 'orders shipped'],
    'procurement.po': ['purchase orders', 'POs', 'procurement orders', 'buying orders'],
    'procurement.vendors': ['vendors', 'suppliers', 'merchants', 'partners', 'sellers'],
    'sales.count': ['sales orders', 'orders', 'customers', 'buyers', 'clients', 'sales records']
  };

  for (const [intent, nouns] of Object.entries(entityMap)) {
    countVerbs.forEach(v => {
      countAdjectives.forEach(a => {
        nouns.forEach(n => {
          // e.g. "how many active employees" -> hr.count
          add(`${v}${a} ${n}`, intent);
          // e.g. "count all system users" -> rbac.count
          add(`${v} the${a} ${n}`, intent);
          // e.g. "what is the number of company suppliers"
          add(`${v} of${a} ${n}`, intent);
        });
      });
    });
  }

  // 3. FINANCE MATRIX
  const finVerbs = ['what is', 'show me', 'calculate', 'tell me', 'get', 'fetch', 'display', 'can i see', 'print', 'how much is'];
  const finAdjectives = ['total ', 'net ', 'gross ', 'overall ', 'current ', 'company ', 'enterprise ', 'my ', 'our ', ''];
  const finNouns = ['revenue', 'income', 'profit', 'money made', 'earnings', 'cash flow', 'finances', 'bottom line', 'sales total', 'money in the bank'];
  
  finVerbs.forEach(v => {
    finAdjectives.forEach(a => {
      finNouns.forEach(n => {
        add(`${v} ${a}${n}`, 'finance.revenue');
        add(`${v} the ${a}${n}`, 'finance.revenue');
      });
    });
  });

  const expNouns = ['expenses', 'spendings', 'costs', 'bills', 'money lost', 'outgoings', 'burn rate', 'financial losses'];
  finVerbs.forEach(v => {
    finAdjectives.forEach(a => {
      expNouns.forEach(n => {
        add(`${v} ${a}${n}`, 'finance.expenses');
        add(`${v} the ${a}${n}`, 'finance.expenses');
      });
    });
  });

  // 4. PREDICTIVE MATRIX
  const predVerbs = ['forecast', 'predict', 'guess', 'estimate', 'project', 'calculate future', 'show upcoming'];
  const predNouns = ['revenue', 'income', 'sales', 'profit', 'money', 'growth', 'numbers', 'earnings'];
  const predTimes = ['', ' next month', ' in the future', ' for next quarter', ' tomorrow', ' soon'];

  predVerbs.forEach(v => {
    predNouns.forEach(n => {
      predTimes.forEach(t => {
        add(`${v} ${n}${t}`, 'forecast.revenue');
        add(`${v} our ${n}${t}`, 'forecast.revenue');
      });
    });
  });

  // 5. SYSTEM MATRIX
  const sysStarts = ['is the system', 'are we', 'is aura', 'check if modules are', 'tell me if system is', 'what is the system'];
  const sysEnds = ['online', 'healthy', 'status', 'up', 'working', 'crashing', 'down', 'live'];
  sysStarts.forEach(s => sysEnds.forEach(e => add(`${s} ${e}`, 'system.health')));

  console.log(`[NLP Trainer] Deep Matrix Algorithm generated ${sentenceCount} unique training sentences.`);
}
