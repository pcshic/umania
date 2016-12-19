/*
  [0] => state name
  [1] => brief state name
  [2] => position in problem API
  [3] => verdict ID
  [4] => color
*/
module.exports = [
  ['Accepted',              'AC',  18, 90, 'green'],
  ['Presentation Error',    'PE',  17, 80, 'olive'],
  ['Wrong Answer',          'WA',  16, 70, 'red'],
  ['Compilation Error',     'CE',  10, 30, 'yellow'],
  ['Runtime Error',         'RE',  12, 40, 'teal'],
  ['Time Limit Exceeded',   'TLE', 14, 50, 'blue'],
  ['Output Limit Exceeded', 'OLE', 13, 45, 'purple'],
  ['Memory Limit Exceeded', 'MLE', 15, 60, 'violet'],
  ['Restricted Function',   'RF',  11, 35, 'pink'],
  ['Submission Error',      'SE',  7,  10, 'black'],
  ['Can\'t be Judged',      'NJ',  8,  15, 'brown'],
  ['In Queue',              'InQ', 9,  20, 'gray']
]