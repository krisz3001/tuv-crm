import { FileTypePipe } from './file-type.pipe';

describe('FileTypePipe', () => {
  it('create an instance', () => {
    const pipe = new FileTypePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return "Ajánlat" when value is 1', () => {
    const pipe = new FileTypePipe();
    expect(pipe.transform(1)).toBe('Ajánlat');
  });

  it('should return "Szerződés" when value is 2', () => {
    const pipe = new FileTypePipe();
    expect(pipe.transform(2)).toBe('Szerződés');
  });

  it('should return "Tanúsítvány" when value is 3', () => {
    const pipe = new FileTypePipe();
    expect(pipe.transform(3)).toBe('Tanúsítvány');
  });

  it('should return "Ismeretlen" when value is not 1, 2 or 3', () => {
    const pipe = new FileTypePipe();
    expect(pipe.transform(100)).toBe('Ismeretlen');
  });
});
