import { CharactersCountPipe } from './characters-count.pipe';

describe('CharactersCountPipe', () => {
  it('create an instance', () => {
    const pipe = new CharactersCountPipe();
    expect(pipe).toBeTruthy();
  });
});
