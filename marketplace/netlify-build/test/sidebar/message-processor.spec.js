import {
  normalizeMessage,
  isOutOfOrder,
  isDuplicate,
  messageToState
} from '../../src/sidebar/message-processor';

import {
  NETLIFY_EVENTS,
  EVENT_TRIGGERED,
  EVENT_TRIGGER_FAILED,
  EVENT_BUILD_STARTED,
  EVENT_BUILD_FAILED,
  EVENT_BUILD_READY
} from '../../src/constants';

describe('message-processor', () => {
  describe('normalizeMessage', () => {
    it('normalizes a valid Netlify event', () => {
      const normalized = normalizeMessage('site-id', [], {
        id: 'build-id',
        site_id: 'site-id',
        state: 'uploaded'
      });

      expect(normalized).toEqual({
        event: EVENT_BUILD_STARTED,
        buildId: 'build-id',
        siteId: 'site-id'
      });
    });

    it('ignores a Netlify event for different site', () => {
      const normalized = normalizeMessage('site-id', [], {
        id: 'build-id',
        site_id: 'different-site',
        state: 'uploaded'
      });

      expect(normalized).toBeNull();
    });

    it('ignores a Netlify event for unsupported state', () => {
      const normalized = normalizeMessage('site-id', [], {
        id: 'build-id',
        site_id: 'site-id',
        state: 'BOOM'
      });

      expect(normalized).toBeNull();
    });

    it('normalizes a valid Contentful event, removes indicator', () => {
      const normalized = normalizeMessage('site-id', [], {
        contentful: true,
        event: EVENT_TRIGGERED,
        someProperty: 'hello world'
      });

      expect(normalized).toEqual({
        event: EVENT_TRIGGERED,
        someProperty: 'hello world',
        userName: null
      });
    });

    it('resolves user name in Contentful events if possible', () => {
      const users = [
        { sys: { id: 'uid1' }, firstName: 'Jakub', lastName: 'Jakub' },
        { sys: { id: 'uid2' }, firstName: 'David', lastName: 'David' }
      ];

      const normalized = normalizeMessage('site-id', users, {
        contentful: true,
        event: EVENT_TRIGGERED,
        userId: 'uid2',
        someProperty: 'hello world'
      });

      expect(normalized).toEqual({
        event: EVENT_TRIGGERED,
        someProperty: 'hello world',
        userId: 'uid2',
        userName: 'David David'
      });
    });

    it('ignores Contentful events for unsupported events', () => {
      const normalized = normalizeMessage('site-id', [], {
        contentful: true,
        event: 'BOOM'
      });

      expect(normalized).toBeNull();
    });
  });

  describe('isOutOfOrder', () => {
    it('returns false if the message is not build start message', () => {
      const result = isOutOfOrder({ event: EVENT_TRIGGERED });

      expect(result).toBe(false);
    });

    it('returns true if the build already failed or succeeded in the past', () => {
      [EVENT_BUILD_FAILED, EVENT_BUILD_READY].forEach(event => {
        const result = isOutOfOrder(
          {
            event: EVENT_BUILD_STARTED,
            buildId: 'build-id'
          },
          [
            { event, buildId: 'some-other-build' },
            { event: 'some-other-event', buildId: 'build-id' },
            { event, buildId: 'build-id' }
          ]
        );

        expect(result).toBe(true);
      });
    });

    it('returns false if there are only events for some other build in the past', () => {
      const result = isOutOfOrder(
        {
          event: EVENT_BUILD_STARTED,
          buildId: 'b3'
        },
        [{ event: EVENT_BUILD_FAILED, buildId: 'b2' }, { event: EVENT_BUILD_READY, buildId: 'b1' }]
      );

      expect(result).toBe(false);
    });
  });

  describe('isDuplicate', () => {
    it('returns true for duplicated Netlify messages', () => {
      const msg = { event: NETLIFY_EVENTS[0], buildId: 'build-id' };
      const result = isDuplicate(msg, [{}, msg]);
      expect(result).toBe(true);
    });

    it('returns false if a Netlify message is not a duplicate', () => {
      const msg = { event: NETLIFY_EVENTS[0], buildId: 'build-id' };
      const result = isDuplicate(msg, [
        { event: NETLIFY_EVENTS[1], buildId: 'build-id' },
        { event: NETLIFY_EVENTS[0], buildId: 'other-build' }
      ]);
      expect(result).toBe(false);
    });

    it('supports Netlify events only, defaults to false for other events', () => {
      const msg = { event: EVENT_TRIGGERED, buildId: 'build-id' };
      const result = isDuplicate(msg, [{}, msg, {}]);
      expect(result).toBe(false);
    });
  });

  describe('messageToState', () => {
    const t = 1564064762154;

    it('produces state for "triggered" message', () => {
      const state = messageToState({
        t,
        event: EVENT_TRIGGERED
      });

      expect(state).toEqual({
        busy: true,
        info: expect.stringMatching(/at 2:26:02 PM/),
        ok: true,
        status: 'Triggering...'
      });
    });

    it('produces state for "triggered" message including the user name', () => {
      const state = messageToState({
        t,
        event: EVENT_TRIGGERED,
        userName: 'Jakub'
      });

      expect(state).toEqual({
        busy: true,
        info: expect.stringMatching(/by Jakub.+at 2:26:02 PM/),
        ok: true,
        status: 'Triggering...'
      });
    });

    it('produces state for "tiggering failed" message', () => {
      const state = messageToState({
        t,
        event: EVENT_TRIGGER_FAILED
      });

      expect(state).toEqual({
        busy: false,
        ok: false,
        info: 'Try again! If the problem persists make sure the Netlify site still exists.'
      });
    });

    it('produces state for "build started" message', () => {
      const state = messageToState({
        t,
        event: EVENT_BUILD_STARTED
      });

      expect(state).toEqual({
        status: 'Building...',
        busy: true,
        ok: true
      });
    });

    it('produces state for "build ready" message', () => {
      const state = messageToState({
        t,
        event: EVENT_BUILD_READY
      });

      expect(state).toEqual({
        busy: false,
        ok: true,
        info: expect.stringMatching(/Last built.+at 2:26:02 PM/)
      });
    });

    it('produces state for "build failed" message', () => {
      const state = messageToState({
        t,
        event: EVENT_BUILD_FAILED,
        error: 'Something wrong happened.'
      });

      expect(state).toEqual({
        busy: false,
        ok: false,
        info: 'Something wrong happened.'
      });
    });
  });
});
