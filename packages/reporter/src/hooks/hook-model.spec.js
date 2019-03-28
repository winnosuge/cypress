import sinon from 'sinon'
import Hook from './hook-model'

describe('Hook model', () => {
  let hook

  beforeEach(() => {
    hook = new Hook({ name: 'before' })
  })

  it('gives hooks unique ids', () => {
    const anotherHook = new Hook({ name: 'test' })

    expect(hook.id).not.to.equal(anotherHook.id)
  })

  context('#addCommand', () => {
    it('adds the command to its command collection', () => {
      hook.addCommand({ isMatchingEvent: () => {
        return false
      } })
      expect(hook.commands.length).to.equal(1)
      hook.addCommand({})
      expect(hook.commands.length).to.equal(2)
    })

    it('numbers commands incrementally when not events', () => {
      const command1 = { event: false, isMatchingEvent: () => {
        return false
      } }

      hook.addCommand(command1)
      expect(command1.number).to.equal(1)

      const command2 = { event: false }

      hook.addCommand(command2)
      expect(command2.number).to.equal(2)
    })

    it('does not number event commands', () => {
      const command1 = { event: false, isMatchingEvent: () => {
        return false
      } }

      hook.addCommand(command1)
      expect(command1.number).to.equal(1)

      const command2 = { event: true, isMatchingEvent: () => {
        return false
      } }

      hook.addCommand(command2)
      expect(command2.number).to.be.undefined

      const command3 = { event: false }

      hook.addCommand(command3)
      expect(command3.number).to.equal(2)
    })

    it('adds command as duplicate if it matches the last command', () => {
      const addDuplicate = sinon.spy()
      const command1 = { event: true, isMatchingEvent: () => {
        return true
      }, addDuplicate }

      hook.addCommand(command1)

      const command2 = { event: true }

      hook.addCommand(command2)

      expect(addDuplicate).to.be.calledWith(command2)
    })
  })

  context('#commandMatchingErr', () => {
    it('returns last command to match the error', () => {
      const matchesButIsntLast = { err: { message: 'matching error message' }, isMatchingEvent: () => {
        return false
      } }

      hook.addCommand(matchesButIsntLast)
      const doesntMatch = { err: { message: 'other error message' }, isMatchingEvent: () => {
        return false
      } }

      hook.addCommand(doesntMatch)
      const matches = { err: { message: 'matching error message' } }

      hook.addCommand(matches)

      expect(hook.commandMatchingErr({ message: 'matching error message' })).to.eql(matches)
    })

    it('returns undefined when no match', () => {
      const noMatch1 = { err: { message: 'some error message' }, isMatchingEvent: () => {
        return false
      } }

      hook.addCommand(noMatch1)
      const noMatch2 = { err: { message: 'other error message' } }

      hook.addCommand(noMatch2)

      expect(hook.commandMatchingErr({ message: 'matching error message' })).to.be.undefined
    })
  })
})
