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
                }`,

            sunset: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.5, 0.5, 0.5);
                    vec3 b = vec3(0.5, 0.5, 0.5);
                    vec3 c = vec3(1.0, 0.7, 0.4);
                    vec3 d = vec3(0.0, 0.15, 0.20);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            forest: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.3, 0.5, 0.2);
                    vec3 b = vec3(0.4, 0.5, 0.3);
                    vec3 c = vec3(0.5, 0.8, 0.4);
                    vec3 d = vec3(0.1, 0.3, 0.6);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            cyberpunk: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.2, 0.2, 0.5);
                    vec3 b = vec3(0.8, 0.6, 0.8);
                    vec3 c = vec3(1.5, 0.5, 0.8);
                    vec3 d = vec3(0.0, 0.3, 0.5);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            arctic: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.6, 0.6, 0.8);
                    vec3 b = vec3(0.3, 0.3, 0.4);
                    vec3 c = vec3(0.5, 0.4, 1.0);
                    vec3 d = vec3(0.0, 0.1, 0.3);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            lava: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.6, 0.2, 0.0);
                    vec3 b = vec3(0.7, 0.4, 0.1);
                    vec3 c = vec3(0.8, 0.6, 0.2);
                    vec3 d = vec3(0.1, 0.0, 0.5);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            galaxy: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.1, 0.1, 0.3);
                    vec3 b = vec3(0.5, 0.3, 0.6);
                    vec3 c = vec3(1.2, 0.6, 0.9);
                    vec3 d = vec3(0.5, 0.8, 0.3);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            toxic: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.2, 0.5, 0.1);
                    vec3 b = vec3(0.7, 0.8, 0.2);
                    vec3 c = vec3(1.3, 0.4, 0.3);
                    vec3 d = vec3(0.2, 0.0, 0.6);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            vaporwave: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.4, 0.3, 0.6);
                    vec3 b = vec3(0.6, 0.5, 0.6);
                    vec3 c = vec3(0.8, 0.3, 0.5);
                    vec3 d = vec3(0.3, 0.4, 0.7);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            ember: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.5, 0.4, 0.1);
                    vec3 b = vec3(0.7, 0.5, 0.2);
                    vec3 c = vec3(0.6, 0.9, 0.3);
                    vec3 d = vec3(0.0, 0.2, 0.5);
                    return a + b * cos(6.28318 * (c * t + d));
                }`,

            aqua: `
                vec3 palette(float t) {
                    vec3 a = vec3(0.2, 0.5, 0.6);
                    vec3 b = vec3(0.3, 0.6, 0.5);
                    vec3 c = vec3(0.4, 0.7, 1.0);
                    vec3 d = vec3(0.1, 0.5, 0.3);
                    return a + b * cos(6.28318 * (c * t + d));
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
            { id: 'monochrome', name: 'Monochrome' },
            { id: 'sunset', name: 'Sunset Warm' },
            { id: 'forest', name: 'Forest Green' },
            { id: 'cyberpunk', name: 'Cyberpunk' },
            { id: 'arctic', name: 'Arctic Ice' },
            { id: 'lava', name: 'Lava Flow' },
            { id: 'galaxy', name: 'Deep Galaxy' },
            { id: 'toxic', name: 'Toxic Waste' },
            { id: 'vaporwave', name: 'Vaporwave' },
            { id: 'ember', name: 'Ember Gold' },
            { id: 'aqua', name: 'Aqua Marine' }
        ];
    }
}
