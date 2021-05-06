import { Piece } from '/server/models/Piece';

describe('Piece class', () => {
  const newPiece = new Piece;
  it('shouls return a new Piece with property type', () => {
    expect(newPiece).toHaveProperty('type');
  });
});
