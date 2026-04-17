class ShaderPalettes {
    static getPaletteFunction(paletteType) {
        const palettes = {
            rainbow: `
                vec3 palette(float t) {
                    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
                }`,

            neon: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.5, 0.5, 0.5);
                    vec3 b = vec3(0.5, 0.5, 0.5);
                    vec3 c = vec3(2.0, 1.0, 0.0);
                    vec3 d = vec3(0.5, 0.2, 0.25);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            cosmic: `
                vec3 palette(float t) {
                    return mix(vec3(0.2, 0.0, 0.8), vec3(0.8, 0.2, 1.0), sin(t * 3.14159) * 0.5 + 0.5);
                }`,

            fire: `
                vec3 palette(float t) {
                    return mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), t);
                }`,

            ocean: `
                vec3 palette(float t) {
                    return mix(vec3(0.0, 0.3, 0.8), vec3(0.0, 0.8, 0.6), t);
                }`,
            
            pastel: `
                vec3 palette(float t) {
                    return vec3(0.9, 0.8, 0.8) * (0.5 + 0.5 * cos(6.28318 * t + vec3(0.0, 0.1, 0.2)));
                }`,

            monochrome: `
                vec3 palette(float t) {
                    return vec3(t);
                }`
        };

        return palettes[paletteType] || palettes.rainbow;
    }

    static getAvailablePalettes() {
        return [
            { id: 'rainbow', name: 'Rainbow Spectrum' },
            { id: 'neon', name: 'Neon Colors' },
            { id: 'cosmic', name: 'Cosmic Purple/Blue' },
            { id: 'fire', name: 'Fire Red/Orange' },
            { id: 'ocean', name: 'Ocean Blue/Green' },
            { id: 'pastel', name: 'Pastel Dreams' },
            { id: 'monochrome', name: 'Monochrome' }
        ];
    }
}
