class ShaderEditor {
    constructor(shaderEngine) {
        this.shaderEngine = shaderEngine;
        this.presetManager = null; 
        this.isEditorVisible = false;
        this.editorView = null;
        this.currentPresetIndex = -1;
        this.compileTimeout = null;
        
        this.cmModules = null;

        // Store bound handlers for cleanup
        this._boundHandlers = {};

        this.setupEventListeners();
    }

    setPresetManager(presetManager) {
        this.presetManager = presetManager;
    }

    setupEventListeners() {
        const closeBtn = document.getElementById('close-editor-btn');
        const compileBtn = document.getElementById('compile-btn');
        const saveShaderBtn = document.getElementById('save-shader-btn');

        // Store bound handlers
        this._boundHandlers.compile = () => this.compileShader();
        this._boundHandlers.save = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showSaveOptions();
        };

        // Note: The edit button and close button toggles are handled by UIManager.togglePanel()
        // We only handle compile and save here
        if(compileBtn) compileBtn.addEventListener('click', this._boundHandlers.compile);
        if (saveShaderBtn) {
            saveShaderBtn.addEventListener('click', this._boundHandlers.save);
        }
    }

    toggleShaderEditor() {
        this.isEditorVisible = !this.isEditorVisible;
        const panel = document.getElementById('editor-panel');
        if(panel) panel.classList.toggle('hidden', !this.isEditorVisible);

        // Sync with UIManager's panelStates
        if (this.uiManager) {
            this.uiManager.panelStates.editor = this.isEditorVisible;
        }

        if (this.isEditorVisible && !this.editorView) {
            this.initializeShaderEditor();
        }
    }

    async initializeShaderEditor() {
        const parent = document.getElementById('shader-editor');
        if(!parent) return;
        
        if (this.editorView) return;
        
        parent.innerHTML = '<div style="padding:20px; color:#888; font-family:monospace;">Loading editor engine...</div>';

        try {
            if (!this.cmModules) {
                const [view, state, lang, commands, language, autocomplete, highlight] = await Promise.all([
                    import("@codemirror/view"),
                    import("@codemirror/state"),
                    import("@codemirror/lang-cpp"),
                    import("@codemirror/commands"),
                    import("@codemirror/language"),
                    import("@codemirror/autocomplete"),
                    import("@lezer/highlight")
                ]);
                this.cmModules = { view, state, lang, commands, language, autocomplete, highlight };
            }

            const { EditorView, keymap, drawSelection, highlightActiveLine, lineNumbers, placeholder } = this.cmModules.view;
            const { EditorState } = this.cmModules.state;
            const { cpp } = this.cmModules.lang;
            const { defaultKeymap, indentWithTab, history, historyKeymap } = this.cmModules.commands;
            const { syntaxHighlighting, HighlightStyle, indentOnInput, bracketMatching, foldGutter } = this.cmModules.language;
            const { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap, completeFromList, completeAnyWord } = this.cmModules.autocomplete;
            const { tags } = this.cmModules.highlight;

            // 1. CUSTOM THEME
            const baseTheme = EditorView.theme({
                "&": {
                    color: "#e0e0e0",
                    backgroundColor: "transparent",
                    height: "100%",
                    fontSize: "14px",
                    fontFamily: "'Space Mono', monospace"
                },
                ".cm-content": { caretColor: "#00ffff" },
                "&.cm-focused": { outline: "none" },
                "&.cm-focused .cm-cursor": { borderLeftColor: "#00ffff" },
                "&.cm-focused .cm-selectionBackground, ::selection": { backgroundColor: "rgba(0, 255, 255, 0.15)" },
                ".cm-gutters": { 
                    backgroundColor: "rgba(0, 0, 0, 0.3)", 
                    color: "#555", 
                    borderRight: "1px solid rgba(255,255,255,0.05)" 
                },
                ".cm-activeLine": { backgroundColor: "rgba(255, 255, 255, 0.03)" },
                ".cm-activeLineGutter": { backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#fff" },
                
                /* Autocomplete Tooltip */
                ".cm-tooltip": {
                    backgroundColor: "#1a1a2a",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    color: "#fff",
                    borderRadius: "4px"
                },
                ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
                    backgroundColor: "rgba(0, 255, 255, 0.3)",
                    color: "#fff"
                }
            }, { dark: true });

            // 2. NEON SYNTAX HIGHLIGHTING
            const neonSyntax = HighlightStyle.define([
                { tag: tags.keyword, color: "#ff79c6", fontWeight: "bold" },      // Pink keywords
                { tag: tags.controlKeyword, color: "#ff79c6", fontWeight: "bold" },
                { tag: tags.typeName, color: "#8be9fd", fontWeight: "bold" },     // Cyan types
                { tag: tags.className, color: "#8be9fd" },
                { tag: tags.definition(tags.variableName), color: "#50fa7b" },    // Green definitions
                { tag: tags.function(tags.variableName), color: "#f1fa8c" },      // Yellow functions
                { tag: tags.number, color: "#bd93f9" },                           // Purple numbers
                { tag: tags.string, color: "#f1fa8c" },                           // Yellow strings
                { tag: tags.comment, color: "#6272a4", fontStyle: "italic" },     // Grey-blue comments
                { tag: tags.operator, color: "#ff79c6" },
                { tag: tags.punctuation, color: "#f8f8f2" },
                { tag: tags.paren, color: "#f8f8f2" },
                { tag: tags.bracket, color: "#f8f8f2" }
            ]);

            // 3. GLSL KEYWORDS FOR AUTOCOMPLETE
            const glslKeywords = [
                "float", "vec2", "vec3", "vec4", "mat2", "mat3", "mat4", 
                "int", "bool", "void", "uniform", "varying", "attribute", 
                "in", "out", "inout", "const", "struct",
                "sin", "cos", "tan", "asin", "acos", "atan", "pow", "exp", "log", 
                "sqrt", "abs", "sign", "floor", "ceil", "fract", "mod", "min", "max", 
                "clamp", "mix", "step", "smoothstep", "length", "distance", "dot", "cross", 
                "normalize", "faceforward", "reflect", "refract", "texture",
                "gl_FragCoord", "fragColor", "u_time", "u_resolution"
            ].map(w => ({ label: w, type: "keyword" }));

            const glslCompletion = (context) => {
                let word = context.matchBefore(/\w*/);
                if (word.from == word.to && !context.explicit) return null;
                return {
                    from: word.from,
                    options: glslKeywords
                };
            };

            // Clear loading text
            parent.innerHTML = '';

            const startCode = this.presetManager && this.presetManager.getCurrentPreset() 
                ? this.presetManager.getCurrentPreset().fragmentShader 
                : this.getDefaultShaderCode();

            const state = EditorState.create({
                doc: startCode,
                extensions: [
                    lineNumbers(),
                    highlightActiveLine(),
                    history(),
                    drawSelection(),
                    bracketMatching(),
                    closeBrackets(),
                    foldGutter(),
                    
                    keymap.of([
                        ...closeBracketsKeymap,
                        ...defaultKeymap,
                        ...historyKeymap,
                        ...completionKeymap,
                        indentWithTab
                    ]),
                    
                    // Language & Completion
                    cpp(),
                    autocompletion({ 
                        override: [glslCompletion, completeAnyWord] // Add GLSL + local word prediction
                    }),
                    
                    // Styles
                    baseTheme,
                    syntaxHighlighting(neonSyntax),
                    
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            this.debounceShaderCompile();
                        }
                    })
                ]
            });

            this.editorView = new EditorView({
                state: state,
                parent: parent
            });

            if (this.presetManager) {
                this.currentPresetIndex = this.presetManager.currentPreset;
            }

        } catch (error) {
            console.error("Failed to load CodeMirror:", error);
            parent.innerHTML = `<div style="padding:20px; color:#ff4444; font-family:monospace;">
                Error loading editor resources.<br>
                <small style="opacity:0.7">${error.message}</small>
            </div>`;
        }
    }

    loadCurrentPresetCode() {
        if (this.presetManager) {
            const currentPreset = this.presetManager.getCurrentPreset();
            if (currentPreset) {
                this.setCode(currentPreset.fragmentShader);
                this.currentPresetIndex = this.presetManager.currentPreset;
            }
        }
    }

    loadPresetCode(presetIndex) {
        if (this.presetManager) {
            const preset = this.presetManager.shaderPresets[presetIndex];
            if (preset) {
                this.setCode(preset.fragmentShader);
                this.currentPresetIndex = presetIndex;
            }
        }
    }

    setCode(newCode) {
        if (this.editorView) {
            const transaction = this.editorView.state.update({
                changes: { from: 0, to: this.editorView.state.doc.length, insert: newCode }
            });
            this.editorView.dispatch(transaction);
        }
    }

    getCode() {
        return this.editorView ? this.editorView.state.doc.toString() : '';
    }

    debounceShaderCompile() {
        if (this.compileTimeout) clearTimeout(this.compileTimeout);
        this.compileTimeout = setTimeout(() => this.compileShader(), 800);
    }

    compileShader() {
        if (!this.editorView) return;

        const fragmentSource = this.getCode();
        const vertexSource = `#version 300 es
            in vec4 a_position;
            void main() {
                gl_Position = a_position;
            }`;

        const result = this.shaderEngine.loadShader(vertexSource, fragmentSource);

        const errorConsole = document.getElementById('error-console');
        if (result.success) {
            errorConsole.innerHTML = '<div style="color: #00ff00;">✓ Shader compiled successfully</div>';
        } else {
            const cleanError = result.error.replace(/\0/g, '').replace(/\n/g, '<br>');
            errorConsole.innerHTML = `<div style="color: #ff4444;">✗ Compilation Error:</div><div style="font-size:11px; opacity:0.8; margin-top:4px; white-space: pre-wrap;">${cleanError}</div>`;
        }
    }

    showSaveOptions() {
        if (!this.editorView) {
            alert('Please open the shader editor first.');
            return;
        }

        const code = this.getCode();
        
        const dialog = document.createElement('div');
        dialog.className = 'save-dialog';
        dialog.style.opacity = '0';
        dialog.innerHTML = `
            <div class="save-dialog-content">
                <h3>Save Shader Changes</h3>
                <div class="save-options">
                    <button class="save-btn overwrite" data-action="overwrite">Overwrite Current</button>
                    <button class="save-btn new" data-action="new">Save as New</button>
                    <button class="save-btn cancel" style="margin-top:10px">Cancel</button>
                </div>
                <div class="new-preset-form hidden">
                    <input type="text" id="new-preset-name" class="preset-name-input" placeholder="Preset Name">
                    <div class="form-buttons">
                        <button class="save-btn confirm">Save</button>
                        <button class="save-btn cancel">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        requestAnimationFrame(() => {
            dialog.style.opacity = '1';
        });

        dialog.addEventListener('click', (e) => {
            const closeDialog = () => {
                dialog.style.opacity = '0';
                setTimeout(() => {
                    if(dialog.parentNode) document.body.removeChild(dialog);
                }, 300);
            };

            if(e.target.classList.contains('cancel')) {
                closeDialog();
            }
            else if(e.target.dataset.action === 'overwrite') {
                Dialogs.confirm("Overwrite the current preset?", "Confirm Overwrite").then(() => {
                    this.presetManager.updatePresetShader(this.currentPresetIndex, code);
                    closeDialog();
                }).catch(() => {
                    // Cancelled - do nothing
                });
            }
            else if(e.target.dataset.action === 'new') {
                dialog.querySelector('.save-options').classList.add('hidden');
                dialog.querySelector('.new-preset-form').classList.remove('hidden');
                dialog.querySelector('#new-preset-name').focus();
            }
            else if(e.target.classList.contains('confirm')) {
                const name = dialog.querySelector('#new-preset-name').value.trim();
                if(name) {
                    this.presetManager.addNewPreset(name, code);
                    closeDialog();
                } else {
                    alert("Please enter a name");
                }
            }
        });
    }

    getDefaultShaderCode() {
        return `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    fragColor = vec4(uv, 0.5 + 0.5 * sin(u_time), 1.0);
}`;
    }

    destroy() {
        // Clear compile timeout
        if (this.compileTimeout) {
            clearTimeout(this.compileTimeout);
            this.compileTimeout = null;
        }

        // Remove event listeners
        const closeBtn = document.getElementById('close-editor-btn');
        const compileBtn = document.getElementById('compile-btn');
        const saveShaderBtn = document.getElementById('save-shader-btn');

        // Note: editBtn and closeBtn handlers are in UIManager, not removed here
        if (compileBtn && this._boundHandlers.compile) {
            compileBtn.removeEventListener('click', this._boundHandlers.compile);
        }
        if (saveShaderBtn && this._boundHandlers.save) {
            saveShaderBtn.removeEventListener('click', this._boundHandlers.save);
        }

        // Destroy CodeMirror editor
        if (this.editorView) {
            this.editorView.destroy();
            this.editorView = null;
        }

        // Clear references
        this._boundHandlers = {};
        this.cmModules = null;
        this.presetManager = null;
        this.shaderEngine = null;

        console.log('ShaderEditor destroyed');
    }
}