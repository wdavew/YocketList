import React from 'react'
import { shallow } from 'enzyme';
import chai from 'chai';
import { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'

import Home from '../../client/components/Home';
import Queue from '../../client/components/Queue';
import Queueapp from '../../client/components/Queueapp';
import Queueform from '../../client/components/Queueform';
import Queuelist from '../../client/components/Queuelist';
import Layout from '../../client/layout';

chai.use(chaiEnzyme());
const spy = sinon.spy();
let wrapper;

xdescribe('React unit tests', () => {

});