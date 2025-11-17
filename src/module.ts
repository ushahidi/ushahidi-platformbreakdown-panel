import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    
    .addFieldNamePicker({
      path: 'fieldMentionsPercent',
      name: '(KPI) Total Posts',
      description: 'Select the total posts field',
    })
    .addFieldNamePicker({
      path: 'fieldMentionsPercent',
      name: '(KPI) Platform Posts',
      description: 'Select the total platform posts field',
    })
    .addFieldNamePicker({
      path: 'fieldMentionsPercent',
      name: '(KPI) Social Media Posts',
      description: 'Select the total social media posts field',
    })
    .addFieldNamePicker({
      path: 'fieldCategory',
      name: 'Category Field',
      description: 'Select the field for category names',
    })
    .addFieldNamePicker({
      path: 'fieldMentionsCount',
      name: 'Social Media Posts Count',
      description: 'Select the total posts fields for each of the social media sources',
    })
    .addFieldNamePicker({
      path: 'fieldMentionsPercent',
      name: 'Mentions Percent Field',
      description: 'Select the percentage field for each of the social media sources',
    })
    .addColorPicker({
      path: 'barColor',
      name: 'Bar Color',
      defaultValue: 'green',
    })
    .addBooleanSwitch({
      path: 'showNumbering',
      name: 'Show numbering',
      description: 'Toggle whether to show numbers (1., 2., etc.) before each category',
      defaultValue: false,
    })
    .addNumberInput({
      path: 'decimalPlaces',
      name: 'Decimal places',
      description: 'Set how many decimal places to display for percentages (max 10)',
      settings: {
        min: 0,
        max: 10,
        step: 1,
      },
      defaultValue: 1,
    });
});
