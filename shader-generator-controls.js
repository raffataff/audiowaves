class ShaderGeneratorControls {
    static MAX_SHADER_CONTROLS = 5;

    static getAvailableControls() {
        return [
            {
                id: 'speed',
                name: 'Time Speed',
                uniform: 'u_speed',
                defaultValue: 1.0,
                min: -3.0,
                max: 5.0,
                description: 'Animation speed (negative reverses time)'
            },
            {
                id: 'intensity',
                name: 'Intensity',
                uniform: 'u_intensity',
                defaultValue: 1.0,
                // FIX: Minimum 0.2 to prevent black screen
                min: 0.2, 
                max: 5.0,
                description: 'Overall intensity multiplier'
            },
            {
                id: 'scale',
                name: 'Zoom Level',
                uniform: 'u_scale',
                defaultValue: 1.0,
                // FIX: Minimum 0.1 to prevent divide-by-zero
                min: 0.01, 
                max: 5.0,
                description: 'Pattern scale/zoom'
            },
            {
                id: 'distortion',
                name: 'Warp Strength',
                uniform: 'u_distortion',
                defaultValue: 0.2,
                min: -2.0,
                max: 4.0,
                description: 'Visual distortion amount'
            },
            {
                id: 'colorShift',
                name: 'Hue Cycle',
                uniform: 'u_colorShift',
                defaultValue: 0.0,
                min: 0.0,
                max: 6.28,
                description: 'Color palette rotation speed'
            },
            {
                id: 'complexity',
                name: 'Detail/Octaves',
                uniform: 'u_complexity',
                defaultValue: 1.0,
                min: 0.1,
                max: 3.0,
                description: 'Fractal iteration count'
            },
            {
                id: 'rotation',
                name: 'Spin Speed',
                uniform: 'u_rotation',
                defaultValue: 0.1,
                min: -2.0,
                max: 2.0,
                description: 'Screen rotation velocity'
            },
            {
                id: 'glow',
                name: 'Bloom/Glow',
                uniform: 'u_glow',
                defaultValue: 1.0,
                min: 0.0,
                max: 4.0,
                description: 'Soft glow intensity'
            },
            {
                id: 'frequency',
                name: 'Pattern Repeat',
                uniform: 'u_frequency',
                defaultValue: 2.0,
                min: 0.1,
                max: 20.0,
                description: 'Pattern tiling frequency'
            },
            {
                id: 'amplitude',
                name: 'Wave Height',
                uniform: 'u_amplitude',
                defaultValue: 1.0,
                // FIX: Minimum 0.1 to prevent black screen
                min: 0.1, 
                max: 5.0,
                description: 'Amplitude of waves and patterns'
            },
            {
                id: 'symmetry',
                name: 'Kaleidoscope',
                uniform: 'u_symmetry',
                defaultValue: 0.0,
                min: 0.0,
                max: 12.0,
                description: 'Number of mirror segments'
            },
            {
                id: 'turbulence',
                name: 'Turbulence',
                uniform: 'u_turbulence',
                defaultValue: 0.5,
                min: 0.0,
                max: 3.0,
                description: 'Noise and chaos amount'
            },
            {
                id: 'feedback',
                name: 'Feedback Amount',
                uniform: 'u_feedback',
                defaultValue: 0.6,
                min: 0.0,
                max: 0.99,
                description: 'Trail persistence'
            },
            {
                id: 'decay',
                name: 'Trail Fade',
                uniform: 'u_decay',
                defaultValue: 0.96,
                min: 0.8,
                max: 0.999,
                description: 'How fast trails vanish'
            }
        ];
    }

    static generateShaderParams(selectedControls) {
        const params = {};
        selectedControls.forEach(control => {
            params[control.id] = control.defaultValue;
        });
        return params;
    }

    static validateControlSelection(selectedControls) {
        return selectedControls.length <= this.MAX_SHADER_CONTROLS;
    }
}
