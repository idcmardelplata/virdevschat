import { EventEmitter } from "events"

/*
 * NOTE: Ensures that the test environment can perform
 * certain types of tests that are required in the project
 */
describe('Smoke test', () => {
  describe('Should test exceptions and rejects', () => {
    test("Should test exceptions", () => {

      const someFunction = () => {
        throw new Error("Some error message")
      }

      expect.assertions(1);
      expect(() => someFunction()).toThrow();
    })
    test('Should rejects with an error when data fetching fails', async () => {
      async function fetchData() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Failed to fetch data'));
          }, 10);
        });
      }

      expect.assertions(1);
      await expect(fetchData()).rejects.toThrow('Failed to fetch data');
    })
  })
  describe("Should test events", () => {
    class Emitter extends EventEmitter {
      sampleFunction() {
        this.emit("Event", "some random data");
      }
    }

    test("Should emit 'Event' with the correct data", () => {
      const mockListener = jest.fn();
      const emitter = new Emitter();

      emitter.on('Event', mockListener);
      emitter.sampleFunction();

      expect(mockListener).toHaveBeenCalledTimes(1)
      expect(mockListener).toHaveBeenCalledWith('some random data');
    });

  })
})
