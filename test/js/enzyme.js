import React from 'react'
import { shallow, mount, render } from 'enzyme';
import chai from 'chai';
import { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'

import Layout from '../../client/layout';
import Home from '../../client/components/Home';
import Queue from '../../client/components/Queue';
import QueueApp from '../../client/components/Queueapp';
import QueueForm from '../../client/components/Queueform';
import QueueList from '../../client/components/Queuelist';
import RouteNotFound from '../../client/components/RouteNotFound'

chai.use(chaiEnzyme());
const spy = sinon.spy();
let wrapper;

describe('React unit tests', () => {
  describe('<Layout />', () => {
    it('Should exist', () => {
      let wrapper = shallow(<Layout />)
      expect(wrapper).to.exist;
    });
  });
  
  describe('<Home />', () => {
    before(() => wrapper = shallow(<Home />));

    it('Should render <div> with id "home"', () => {
      expect(wrapper).to.have.tagName('div');
      expect(wrapper).to.have.id('home');
    });

    it('Should render two forms', () => {
      expect(wrapper).to.have.exactly(2).descendants('form');
    });

    it('Should have a button with text "Create room"', () => {
      expect(wrapper.find('#create-room')).to.have.text('Create room');
    });

    it('Should have a button with text "Join room"', () => {
      expect(wrapper.find('#join-room')).to.have.text('Join room');
    });
  });

  describe('<Queue />', () => {
    before(() => wrapper = shallow(<Queue link="https://www.youtube.com/watch?v=psGrFW69l8Q" />));

    it('Should render <div>', () => {
      expect(wrapper.type()).to.equal('div');
    });
  });

  describe('<QueueApp />', () => {
    before(() => wrapper = shallow(<QueueApp params={{ roomName: 'room1' }} />));

    it('Should have state "queues" with value deeply equivalent to []', () => {
      expect(wrapper).to.have.state('queues').deep.equal([]);
    });

    it('Should render <div>', () => {
      expect(wrapper).to.have.tagName('div');
    });
  });

  describe('<QueueForm />', () => {
    before(() => wrapper = shallow(<QueueForm />));

    it('Should render <form> with name "addLink"', () => {
      expect(wrapper.type()).to.equal('form');
      expect(wrapper).to.have.attr('name').equal('addLink')
    });

    it('Should render one input field', () => {
      expect(wrapper).to.have.exactly(1).descendants('input');
    });

    it('Should have input with id "link" and name "link"', () => {
      expect(wrapper.find('#link')).to.have.attr('name').equal('link');
    });
  });

  describe('<QueueList />', () => {
    before(() => wrapper = shallow(<QueueList queues={['https://www.youtube.com/watch?v=yk0kMOKmp50']} />));

    it('Should render one <div>', () => {
      expect(wrapper).to.have.exactly(1).descendants('div');
    });
  });

  describe('<RouteNotFound />', () => {
    before(() => wrapper = shallow(<RouteNotFound />));

   it('Should render <h1>', () => {
      expect(wrapper.type()).to.equal('h1');
    });
  });
});