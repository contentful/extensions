import PropTypes from 'prop-types';

export const VariationType = PropTypes.shape({
  archived: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  weight: PropTypes.number,
  key: PropTypes.string.isRequired,
  variation_id: PropTypes.number.isRequired,
  description: PropTypes.string
});

export const ExperimentType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string.isRequired,
  variations: PropTypes.arrayOf(VariationType.isRequired).isRequired
});
