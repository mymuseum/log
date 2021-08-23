function t (n, x, e) {
  x !== e
    ? console.error(`\u2715 ${n}: ${x}`)
    : console.log(`%c\u2714 ${n}`, 'color:#83BD75');
}

console.log('CONSOLE.JS');

console.log('DATA.JS');

t('data.parse (empty [])', LOG.data.parse([]), undefined);
t('data.parse [!{}]', LOG.data.parse([1]), undefined);
t('data.parse (non-array)', LOG.data.parse(1), undefined);

console.log('');

t('entByDate !Date', LOG.data.entByDate(0), undefined);
t('entByDate past', LOG.data.entByDate(new Date(1997, 2, 2)), undefined);
t('entByDate future', LOG.data.entByDate(new Date(2019, 2, 2)), undefined);

console.log('');

t('entByPeriod !Date', LOG.data.entByPeriod(1), undefined);
t('entByPeriod !Date', LOG.data.entByPeriod(new Date(), 1), undefined);
t('entByPeriod impossible range', LOG.data.entByPeriod(new Date(2018, 0, 2), new Date(2018, 0, 1)), undefined);

console.log('');

t('recent string', LOG.data.recent('1'), undefined);
t('recent 0', LOG.data.recent(0), undefined);

console.log('');

t('entByDay string', LOG.data.entByDay('Sunday'), undefined);
t('entByDay invalid number', LOG.data.entByDay(-1), undefined);
t('entByDay invalid number', LOG.data.entByDay(8), undefined);
t('entByDay empty []', LOG.data.entByDay(0, []), undefined);
t('entByDay invalid array', LOG.data.entByDay(0, [1]), undefined);

console.log('');

t('entByPro nonexistent', LOG.data.entByPro('Egg'), undefined);
t('entByPro [!{}]', LOG.data.entByPro('Log', [1]), undefined);
t('entByPro non-string', LOG.data.entByPro(1), undefined);

console.log('');

t('entBySec nonexistent', LOG.data.entBySec('Egg'), undefined);
t('entBySec [!{}]', LOG.data.entBySec('Code', [1]), undefined);
t('entBySec non-string', LOG.data.entBySec(1), undefined);

console.log('');

t('sortEntries [!{}]', LOG.data.sortEntries([1]), undefined);
t('sortEntries !Date', LOG.data.sortEntries(undefined, 1), undefined);

t('sortentByDay [!{}]', LOG.data.sortEntriesByDay([1]), undefined);

console.log('');

const a = [1, 2, 3, 4, 5];

t('Min value [num]', LOG.data.min(a), 1);
t('Max value [num]', LOG.data.max(a), 5);
t('Avg value [num]', LOG.data.avg(a), 3);

t('Min value [!num]', LOG.data.min(['a']), undefined);
t('Max value [!num]', LOG.data.max(['a']), undefined);
t('Avg value [!num]', LOG.data.avg(['a']), undefined);

t('Min value (empty set)', LOG.data.min([]), 0);
t('Max value (empty set)', LOG.data.max([]), 0);
t('Avg value (empty set)', LOG.data.avg([]), 0);

console.log('');

// t('LOG.journal.displayEntry', LOG.journal.displayEntry(0), undefined);
