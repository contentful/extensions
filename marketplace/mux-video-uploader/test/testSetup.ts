import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import 'isomorphic-fetch';

Enzyme.configure({ adapter: new Adapter() });
