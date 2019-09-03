import React from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  Typography,
  Subheading,
  SectionHeading,
  Paragraph,
  Tooltip,
  TextLink,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  TabPanel
} from '@contentful/forma-36-react-components';

export class DetailsDialog extends React.Component {
  render() {
    console.log(this.props.extension);
    const readableResult = this.props.extension.parameters.invocation.readableResult;
    return <ReadableDetails results={readableResult} />;
  }
}

class ReadableDetails extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'readablity'
    };
  }

  setSelected = id => {
    this.setState({ selectedTab: id });
  };

  render() {
    const { selectedTab } = this.state;
    const { results } = this.props;

    return (
      <React.Fragment>
        <Tabs withDivider={true}>
          <Tab id="readablity" selected={selectedTab === 'readablity'} onSelect={this.setSelected}>
            Readability scores
          </Tab>
          <Tab id="spelling" selected={selectedTab === 'spelling'} onSelect={this.setSelected}>
            Spelling, grammar and quality
          </Tab>
          <Tab id="balance" selected={selectedTab === 'balance'} onSelect={this.setSelected}>
            Balance: Tone, sentiment and more
          </Tab>
          <Tab id="statistics" selected={selectedTab === 'statistics'} onSelect={this.setSelected}>
            Word count and statistics
          </Tab>
        </Tabs>
        {selectedTab === 'readablity' && (
          <TabPanel id="readablity">
            <ReadabilityTab results={results} />
          </TabPanel>
        )}
        {selectedTab === 'spelling' && <TabPanel id="spelling">content second tab</TabPanel>}
        {selectedTab === 'balance' && <TabPanel id="balance">content third tab</TabPanel>}
        {selectedTab === 'statistics' && <TabPanel id="statistics">content fourth tab</TabPanel>}
      </React.Fragment>
    );
  }
}

const valueDetailsMap = {
  flesch_kincaid_grade_level: {
    name: 'Flesch-Kincaid Grade Level',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  gunning_fog_score: {
    name: 'Gunning Fog Index',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  coleman_liau_index: {
    name: 'Coleman-Liau Index',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  smog_index: {
    name: 'SMOG Index',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  automated_readability_index: {
    name: 'Automated Readability Index',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  forcast_grade: {
    name: 'FORCAST Grade Level',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  powers_sumner_kearl_score: {
    name: 'Powers Sumner Kearl Grade',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  rix_score: {
    name: 'Rix Readability',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  raygor_grade: {
    name: 'Raygor Readability',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  fry_grade: {
    name: 'Fry Readability',
    valueTooltip: 'Try to aim for a grade level below 10.',
    highBound: 10
  },
  flesch_kincaid_reading_ease: {
    name: 'Flesch Reading Ease',
    valueTooltip: 'Try to aim for a reading ease over 60.',
    lowBound: 60
  },
  cefr_level: {
    name: 'CEFR Level'
  },
  ielts_level: {
    name: 'IELTS Level'
  },
  spache_readability_score: {
    name: 'Spache Score'
  },
  dale_chall_readability_score: {
    name: 'New Dale-Chall Score'
  },
  lix_score: {
    name: 'Lix Readability',
    valueTooltip: 'Try to aim for a score below 40.',
    lowBound: 40
  },
  lensear_write: {
    name: 'Lensear Write',
    valueTooltip: 'Try to aim for a score between 70 and 80.',
    lowBound: 70,
    highBound: 80
  }
};

const readabilityGradeLevels = [
  'flesch_kincaid_grade_level',
  'gunning_fog_score',
  'coleman_liau_index',
  'smog_index',
  'automated_readability_index',
  'forcast_grade',
  'powers_sumner_kearl_score',
  'rix_score',
  'raygor_grade',
  'fry_grade'
];

const readabilityScores = [
  'flesch_kincaid_reading_ease',
  'cefr_level',
  'ielts_level',
  'spache_readability_score',
  'dale_chall_readability_score',
  'lix_score',
  'lensear_write'
];

function ReadabilityTab({ results }) {
  return (
    <React.Fragment>
      <Subheading>Readability Rating</Subheading>
      <Tooltip content="Readable's bespoke rating system grades you from A to E for readability. Text aimed at the general public should be grade B or better.">
        Rating: <span className={`rating rating${results.rating}`}>{results.rating}</span>
      </Tooltip>
      <Subheading>Readability Grade Levels</Subheading>
      <Table>
        <TableBody>
          {readabilityGradeLevels.map(id => {
            const details = valueDetailsMap[id];
            return (
              <ResultRow
                key={id}
                name={details.name}
                value={results[id]}
                valueTooltip={details.valueTooltip}
                highBound={details.highBound}
              />
            );
          })}
        </TableBody>
      </Table>
      <Subheading>Readability Scores</Subheading>
      <Table>
        <TableBody>
          {readabilityScores.map(id => {
            const details = valueDetailsMap[id];
            return (
              <ResultRow
                key={id}
                name={details.name}
                value={results[id]}
                valueTooltip={details.valueTooltip}
                highBound={details.highBound}
                lowBound={details.lowBound}
              />
            );
          })}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

function ResultRow({ name, value, valueTooltip, highBound, lowBound }) {
  let className = '';
  if (highBound !== undefined && lowBound !== undefined) {
    className = value < highBound && value > lowBound ? 'inbounds' : 'outofbounds';
  } else if (highBound !== undefined) {
    className = value < highBound ? 'inbounds' : 'outofbounds';
  } else if (lowBound !== undefined) {
    className = value > lowBound ? 'inbounds' : 'outofbounds';
  }

  const hasValueTooltip = valueTooltip !== undefined;

  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell className={className}>
        {hasValueTooltip ? <Tooltip content={valueTooltip}>{value}</Tooltip> : value}
      </TableCell>
    </TableRow>
  );
}

DetailsDialog.propTypes = {
  extension: PropTypes.object.isRequired
};
