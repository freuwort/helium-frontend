<template>
    <div class="editor-wrapper" :class="{'fullscreen': isFullscreen, 'simplified': simplified, 'sticky': sticky}" v-if="editor">
        <div class="editor-controls">
            <div class="toolbar-panel label-panel" v-if="label">
                <small><b>{{ label }}</b></small>
            </div>
            
            <div class="toolbar-panel tab-panel">
                <button type="button" class="toolbar-button" :class="{'is-active': tab === 'home'}" @click="tab = 'home'">Home</button>
                <button type="button" class="toolbar-button" :class="{'is-active': tab === 'insert'}" @click="tab = 'insert'">Einfügen</button>
                <button type="button" class="toolbar-button" :class="{'is-active': tab === 'view'}" @click="tab = 'view'">Ansicht</button>
                <button type="button" class="toolbar-button" :class="{'is-active': tab === 'table'}" @click="tab = 'table'" v-show="editor.isActive('table')">Tabelle</button>
                
                <HeSpacer />

                <IodIconButton type="button" size="s" variant="text" icon="undo" :disabled="!editor.can().undo()" @click="editor.chain().focus().undo().run()" v-tooltip="'Rückgängig'"/>
                <IodIconButton type="button" size="s" variant="text" icon="redo" :disabled="!editor.can().redo()" @click="editor.chain().focus().redo().run()" v-tooltip="'Wiederholen'"/>
                <IodIconButton type="button" class="ml-2" size="s" variant="text" :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="toggleFullscreen()" v-if="fullscreenAvailable" v-tooltip.bottom="isFullscreen ? 'Vollbild verlassen' : 'Vollbild'" v-show="!simplified && allowsFullscreen"/>
            </div>



            <div class="styling-panel small-scrollbar" v-show="tab === 'home'">
                <div class="group w-40">
                    <select class="h-8 w-full p-0 px-2 bg-background-soft" :value="getNodeType" @change="setNodeType($event.target.value)">
                        <option value="p">Fließtext</option>
                        <option value="h1">Titel 1</option>
                        <option value="h2">Titel 2</option>
                        <option value="h3">Titel 3</option>
                        <option value="h4">Titel 4</option>
                        <option value="h5">Titel 5</option>
                        <option value="h6">Titel 6</option>
                        <option value="" disabled>---</option>
                    </select>
                    <IodButtonGroup class="w-full bg-background-soft">
                        <IodIconButton type="button" size="s" :variant="editor.isActive({ textAlign: 'left' }) ? 'contained' : 'text'" icon="format_align_left" @click="editor.chain().focus().setTextAlign('left').run()" v-tooltip="'Linksbündig'"/>
                        <IodIconButton type="button" size="s" :variant="editor.isActive({ textAlign: 'center' }) ? 'contained' : 'text'" icon="format_align_center" @click="editor.chain().focus().setTextAlign('center').run()" v-tooltip="'Zentriert'"/>
                        <IodIconButton type="button" size="s" :variant="editor.isActive({ textAlign: 'right' }) ? 'contained' : 'text'" icon="format_align_right" @click="editor.chain().focus().setTextAlign('right').run()" v-tooltip="'Rechtsbündig'"/>
                    </IodButtonGroup>
                </div>
                <HeDivider vertical class="h-full" />
                <div class="group w-40">
                    <IodIconButton type="button" size="s" :variant="editor.isActive('bold') ? 'contained' : 'text'" icon="format_bold" @click="editor.chain().focus().toggleBold().run()" v-tooltip="'Fett'"/>
                    <IodIconButton type="button" size="s" :variant="editor.isActive('italic') ? 'contained' : 'text'" icon="format_italic" @click="editor.chain().focus().toggleItalic().run()" v-tooltip="'Kursiv'"/>
                    <IodIconButton type="button" size="s" :variant="editor.isActive('underline') ? 'contained' : 'text'" icon="format_underlined" @click="editor.chain().focus().toggleUnderline().run()" v-tooltip="'Unterstrichen'"/>
                    <IodIconButton type="button" size="s" :variant="editor.isActive('strike') ? 'contained' : 'text'" icon="strikethrough_s" @click="editor.chain().focus().toggleStrike().run()" v-tooltip="'Durchstrichen'"/>
                    <IodIconButton type="button" size="s" :variant="editor.isActive('blockquote') ? 'contained' : 'text'" icon="format_quote" @click="editor.chain().focus().toggleBlockquote().run()" v-tooltip="'Zitat'"/>
                    <IodIconButton type="button" size="s" :variant="editor.isActive('code') ? 'contained' : 'text'" icon="code" @click="editor.chain().focus().toggleCode().run()" v-tooltip="'Code'"/>
                    <VDropdown placement="top">
                        <IodIconButton type="button" size="s" variant="text" icon="colors" v-tooltip="'Textfarbe'" />
                        
                        <template #popper>
                            <div class="flex flex-wrap p-6 gap-2 w-80">
                                <IodIconButton type="button" icon="palette" corner="pill" size="s" v-for="swatch in swatches" :background="swatch" @click="editor.chain().focus().setColor(swatch).run()"/>
                                <IodButton class="w-full mt-4" corner="pill" size="s" variant="text" border label="Zurücksetzen" @click="editor.chain().focus().unsetColor().run()"/>
                            </div>
                        </template>
                    </VDropdown>
                </div>
                <HeDivider vertical class="h-full" />
                <div class="group w-24" v-if="!simplified">
                    <IodIconButton type="button" size="s" :variant="editor.isActive('bulletList') ? 'filled' : 'text'" icon="format_list_bulleted" @click="editor.chain().focus().toggleBulletList().run()" v-tooltip="'Aufzählung'"/>
                    <IodIconButton type="button" size="s" :variant="editor.isActive('orderedList') ? 'filled' : 'text'" icon="format_list_numbered" @click="editor.chain().focus().toggleOrderedList().run()" v-tooltip="'Nummerierung'"/>
                    
                    <VDropdown placement="top">
                        <IodIconButton type="button" size="s" variant="text" icon="link" v-tooltip="'Link einzufügen'" @click="openLinkDialog"/>
                        
                        <template #popper="{ hide }">
                            <div class="flex flex-col p-2 gap-2 w-96">
                                <IodButtonGroup class="bg-background-soft">
                                    <IodIconButton type="button" :variant="linkForm.target === '_blank' ? 'contained' : 'text'" icon="open_in_new" size="s" @click="linkForm.target = '_blank'" v-tooltip="'Neues Fenster'" />
                                    <IodIconButton type="button" :variant="linkForm.target === '_self' ? 'contained' : 'text'" icon="web_asset" size="s" @click="linkForm.target = '_self'" v-tooltip="'Im gleichen Fenster'" />
                                </IodButtonGroup>
                                <IodInput type="url" placeholder="URL" v-model="linkForm.url" @keyup.enter="insertLink(); hide()">
                                    <template #right>
                                        <IodIconButton type="button" icon="check" size="s" @click="insertLink()" v-close-popper/>
                                    </template>
                                </IodInput>
                            </div>
                        </template>
                    </VDropdown>
                    <IodIconButton type="button" size="s" variant="text" icon="link_off" :disabled="!editor.isActive('link')" @click="removeLink()" v-tooltip="'Link entfernen'"/>
                </div>
                <HeDivider vertical class="h-full" />
                <div class="group">
                    <IodIconButton type="button" size="s" variant="text" icon="format_clear" @click="editor.chain().focus().clearNodes().unsetAllMarks().run()" v-tooltip="'Formatierung entfernen'"/>
                </div>
            </div>

            <div class="styling-panel small-scrollbar" v-show="tab === 'insert'">
                <div class="group">
                    <IodIconButton type="button" size="s" variant="text" icon="image" v-tooltip="'Bild einzufügen'" @click="$refs.picker.open((item) => { imageForm.url = item.cdn_path; insertImage() })"/>
                </div>
                <HeDivider vertical class="h-full" />
                <div class="group">
                    <IodIconButton type="button" size="s" variant="text" icon="table" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3}).run()" v-tooltip="'Tabelle einfügen'"/>
                </div>
                <HeDivider vertical class="h-full" />
                <div class="group">
                    <IodIconButton type="button" size="s" variant="text" icon="horizontal_rule" @click="editor.chain().focus().setHorizontalRule().run()" v-tooltip="'Horizontale Linie einfügen'"/>
                </div>
            </div>

            <div class="styling-panel small-scrollbar" v-show="tab === 'table'">
                <div class="group">
                    <IodIconButton type="button" size="s" variant="text" icon="splitscreen_left" @click="editor.chain().focus().addColumnBefore().run()" v-tooltip="'Neue Spalte rechts'"/>
                    <IodIconButton type="button" size="s" variant="text" icon="delete" @click="editor.chain().focus().deleteColumn().run()" v-tooltip="'Spalte löschen'"/>
                    <IodIconButton type="button" size="s" variant="text" icon="splitscreen_right" @click="editor.chain().focus().addColumnAfter().run()" v-tooltip="'Neue Spalte links'"/>
                </div>
                <HeDivider vertical class="h-full" />
                <div class="group">
                    <IodIconButton type="button" size="s" variant="text" icon="splitscreen_top" @click="editor.chain().focus().addRowBefore().run()" v-tooltip="'Neue Zeile drüber'"/>
                    <IodIconButton type="button" size="s" variant="text" icon="delete" @click="editor.chain().focus().deleteRow().run()" v-tooltip="'Zeile löschen'"/>
                    <IodIconButton type="button" size="s" variant="text" icon="splitscreen_bottom" @click="editor.chain().focus().addRowAfter().run()" v-tooltip="'Neue Zeile drunter'"/>
                </div>
                <HeDivider vertical class="h-full" />
                <div class="group w-16">
                    <IodIconButton type="button" size="s" variant="text" icon="cell_merge" @click="editor.chain().focus().mergeOrSplit().run()" v-tooltip="'Zelle Zusammenführen'"/>
                    <IodIconButton type="button" size="s" variant="text" icon="title" @click="editor.chain().focus().toggleHeaderCell().run()" v-tooltip="'Überschrift Zelle'"/>
                </div>
                <HeDivider vertical class="h-full" />
                <div class="group">
                    <IodIconButton type="button" size="s" variant="text" icon="delete_forever" @click="editor.chain().focus().deleteTable().run()" v-tooltip="'Tabelle löschen'"/>
                </div>
            </div>

            <div class="styling-panel small-scrollbar" v-show="tab === 'view'">
                <div class="group w-80">
                    <IodToggle label="Editorbreite limitieren" style="padding: 0; min-height: 2rem" v-model="applyLimiter"/>
                    <IodToggle label="Rechtschreibprüfung" style="padding: 0; min-height: 2rem" v-model="applySpellcheck"/>
                </div>
            </div>
        </div>



        <div class="editor-content">
            <editor-content class="editor-limiter formatted-content" :class="{'ignore-limiter': !applyLimiter}" :spellcheck="applySpellcheck" lang="de" :editor="editor" />
        </div>



        <DialogMediaPicker ref="picker" />
    </div>
</template>

<script>
    import { Editor, EditorContent } from '@tiptap/vue-3'
    import { Node, mergeAttributes } from '@tiptap/core'
    import Link from '@tiptap/extension-link'
    import Image from '@tiptap/extension-image'
    import Underline from '@tiptap/extension-underline'
    import CharacterCount from '@tiptap/extension-character-count'
    import TextAlign from '@tiptap/extension-text-align'
    import TextStyle from '@tiptap/extension-text-style'
    import Table from '@tiptap/extension-table'
    import TableCell from '@tiptap/extension-table-cell'
    import TableHeader from '@tiptap/extension-table-header'
    import TableRow from '@tiptap/extension-table-row'
    import Color from '@tiptap/extension-color'
    import StarterKit from '@tiptap/starter-kit'



    const swatches = [
        'rgb(34 197 94)',
        'rgb(245 158 11)',
        'rgb(249 115 22)',
        'rgb(244 63 94)',
        'rgb(168 85 247)',
        'rgb(99 102 241)',
        'rgb(59 130 246)',

        'rgb(74 222 128)',
        'rgb(251 191 36)',
        'rgb(251 146 60)',
        'rgb(251 113 133)',
        'rgb(192 132 252)',
        'rgb(129 140 248)',
        'rgb(96 165 250)',
    ]



    export default {
        props: {
            modelValue: {
                type: String,
                default: '',
            },
            label: {
                type: String,
                default: '',
            },
            allowFullscreen: {
                type: Boolean,
                default: false,
            },
            simplified: {
                type: Boolean,
                default: false,
            },
            sticky: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                editor: null,
                linkForm: {
                    url: '',
                    target: '_blank',
                    rel: '',
                },
                imageForm: {
                    url: '',
                    alt: '',
                },
                tab: 'home',
                swatches,
                fullscreenAvailable: false,
                isFullscreen: false,
                applyLimiter: true,
                applySpellcheck: true,
            }
        },
        mounted() {
            this.editor = new Editor({
                extensions: [
                    StarterKit.configure({
                        heading: {
                            levels: [1, 2, 3, 4, 5, 6,],
                        },
                        blockquote: {
                            HTMLAttributes: {
                                class: 'content-blockquote',
                            },
                        },
                    }),
                    Link.configure({
                        linkOnPaste: true,
                        openOnClick: false,
                    }),
                    Image.configure({
                        HTMLAttributes: {
                            class: 'content-image',
                        },
                    }),
                    Underline.configure({
                        HTMLAttributes: {
                            class: 'content-underline',
                        },
                    }),
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                        alignments: ['left', 'center', 'right'],
                    }),
                    TextStyle,
                    Color,
                    CharacterCount,
                    Table.extend({
                        renderHTML({ HTMLAttributes }) {
                            return ['div', { class: 'table-wrapper' }, ['table', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['tbody', 0]]];
                        },
                    })
                    .configure({
                        resizable: true,
                    }),
                    TableRow,
                    TableHeader.extend({
                        addAttributes() {
                            return {
                                colspan: {
                                    default: 1
                                },
                                rowspan: {
                                    default: 1
                                },
                                colwidth: {
                                    default: null,
                                    parseHTML: (element) => {
                                        const colwidth = element.getAttribute("colwidth");
                                        const value = colwidth
                                            ? colwidth.split(",").map((item) => parseInt(item, 10))
                                            : null;

                                        return value;
                                    }
                                },
                                style: {
                                    default: null
                                }
                            };
                        },
                        renderHTML({ HTMLAttributes }) {
                            let totalWidth = 0;
                            let fixedWidth = true;

                            if (HTMLAttributes.colwidth) {
                                HTMLAttributes.colwidth.forEach((col) => {
                                    if (!col) {
                                        fixedWidth = false;
                                    } else {
                                        totalWidth += col;
                                    }
                                });
                            } else {
                                fixedWidth = false;
                            }

                            if (fixedWidth && totalWidth > 0) {
                                HTMLAttributes.style = `width: ${totalWidth}px;`;
                            } else if (totalWidth && totalWidth > 0) {
                                HTMLAttributes.style = `min-width: ${totalWidth}px`;
                            } else {
                                HTMLAttributes.style = null;
                            }

                            return [
                                "th",
                                mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
                                0
                            ];
                        }
                    }),
                    TableCell.extend({
                        addAttributes() {
                            return {
                                colspan: {
                                    default: 1
                                },
                                rowspan: {
                                    default: 1
                                },
                                colwidth: {
                                    default: null,
                                    parseHTML: (element) => {
                                        const colwidth = element.getAttribute("colwidth");
                                        const value = colwidth
                                            ? colwidth.split(",").map((item) => parseInt(item, 10))
                                            : null;

                                        return value;
                                    }
                                },
                                style: {
                                    default: null
                                }
                            };
                        },
                        renderHTML({ HTMLAttributes }) {
                            let totalWidth = 0;
                            let fixedWidth = true;

                            if (HTMLAttributes.colwidth) {
                                HTMLAttributes.colwidth.forEach((col) => {
                                    if (!col) {
                                        fixedWidth = false;
                                    } else {
                                        totalWidth += col;
                                    }
                                });
                            } else {
                                fixedWidth = false;
                            }

                            if (fixedWidth && totalWidth > 0) {
                                HTMLAttributes.style = `width: ${totalWidth}px;`;
                            } else if (totalWidth && totalWidth > 0) {
                                HTMLAttributes.style = `min-width: ${totalWidth}px`;
                            } else {
                                HTMLAttributes.style = null;
                            }

                            return [
                                "td",
                                mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
                                0
                            ];
                        }
                    }),
                ],
                content: this.modelValue,
                onUpdate: () => {
                    this.$emit('update:modelValue', this.editor.getHTML())
                },
            })



            this.isFullscreen = !!document.fullscreenElement
            this.fullscreenAvailable = document.fullscreenEnabled

            window.addEventListener('fullscreenchange', () => {
                this.isFullscreen = !!document.fullscreenElement
                document.documentElement.style.overflowY = this.isFullscreen ? 'hidden' : 'scroll'
            })
        },

        beforeUnmount() {
            this.editor.destroy()
        },

        watch: {
            modelValue(value)
            {
                if (this.editor.getHTML() === value) return
                this.editor.commands.setContent(value, false)
            },
        },

        computed: {
            getNodeType()
            {
                if      (this.editor.isActive('paragraph')) return 'p'
                else if (this.editor.isActive('heading'))   return 'h' + this.editor.getAttributes('heading').level
                else    return ''
            },
        },

        methods: {
            toggleFullscreen()
            {
                this.isFullscreen ? this.exitFullscreen() : this.enterFullscreen()
            },

            enterFullscreen()
            {
                document.documentElement.requestFullscreen()
            },

            exitFullscreen()
            {
                document.exitFullscreen()
            },

            setNodeType(type)
            {
                switch (type) {
                    case 'p': this.editor.chain().focus().setParagraph().run(); break
                    case 'h1': this.editor.chain().focus().setHeading({ level: 1 }).run(); break
                    case 'h2': this.editor.chain().focus().setHeading({ level: 2 }).run(); break
                    case 'h3': this.editor.chain().focus().setHeading({ level: 3 }).run(); break
                    case 'h4': this.editor.chain().focus().setHeading({ level: 4 }).run(); break
                    case 'h5': this.editor.chain().focus().setHeading({ level: 5 }).run(); break
                    case 'h6': this.editor.chain().focus().setHeading({ level: 6 }).run(); break
                }
            },

            openLinkDialog()
            {
                this.linkForm.url = this.editor.getAttributes('link').href || ''
                this.linkForm.target = this.editor.getAttributes('link').target || '_blank'
                this.linkForm.rel = this.editor.getAttributes('link').rel || ''
            },

            insertLink()
            {
                this.editor.chain().focus().extendMarkRange('link').setLink({
                    href: this.linkForm.url,
                    target: this.linkForm.target,
                    rel: this.linkForm.rel,
                }).run()
            },

            removeLink()
            {
                this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
            },

            openImageDialog()
            {
                this.imageForm.url = this.editor.getAttributes('image').src || ''
                this.imageForm.alt = this.editor.getAttributes('image').alt || ''
            },

            insertImage() {
                this.editor.chain().focus().setImage({
                    src: this.imageForm.url,
                    alt: this.imageForm.alt,
                }).run()
            },
        },

        components: {
            EditorContent,
        },
    }
</script>

<style lang="sass">
    .editor-limiter
        > div.ProseMirror
            flex: 1
            display: inline-block
            width: 100%
            padding: 0 1rem

            &:focus
                outline: none
</style>

<style lang="sass" scoped>
    .swatch.blog-editor
        display: flex
        align-items: center
        justify-content: center
        font-size: 1rem
        font-family: var(--font-interface)
        color: var(--color-text-soft)
        padding: 0 .5rem
        height: 2.5rem
        aspect-ratio: 1
        border-radius: 5px
        cursor: pointer
        user-select: none
        border: 2px solid var(--color-background)
        box-shadow: 0 0 0 1px var(--color-border)
        background: var(--color-background)

        &:hover
            box-shadow: 0 0 0 1px var(--color-primary)

        &.fullwidth
            grid-column: 1 / -1
            aspect-ratio: unset

    .editor-wrapper
        min-height: 10rem
        width: 100%
        display: flex
        flex-direction: column
        background: var(--color-background-soft)
        border-radius: var(--radius-m)
        position: relative

        &.sticky
            .editor-controls
                position: sticky

        &.fullscreen
            position: fixed
            top: 0
            left: 0
            width: 100vw
            height: 100vh
            z-index: 10000
            border-radius: 0
            overflow-y: auto
            overflow-x: hidden

            .editor-content
                padding: 2rem

        .editor-controls
            flex: none
            position: relative
            z-index: 1
            display: flex
            flex-direction: column
            background: var(--color-background-soft)
            position: relative
            top: 0
            border-top-left-radius: inherit
            border-top-right-radius: inherit

            .iod-button
                --color-primary: var(--color-text)

            .toolbar-panel
                display: flex
                align-items: center
                min-height: 2.25rem
                padding: 0 1rem
                border-right: 1px solid var(--color-background-soft)
                border-left: 1px solid var(--color-background-soft)
                overflow: hidden

                &.tab-panel
                    padding-inline: .75rem

                &:first-child
                    border-top-left-radius: inherit
                    border-top-right-radius: inherit

                .spacer
                    flex: 1

                .toolbar-button
                    display: flex
                    align-items: center
                    padding: 0 1rem
                    margin: 0
                    margin-top: .25rem
                    height: 2rem
                    border-radius: var(--radius-m)
                    border: none
                    cursor: pointer
                    user-select: none
                    font-size: .8rem
                    font-weight: 500
                    font-family: var(--font-interface)
                    color: var(--color-text-soft)
                    position: relative

                    &::before,
                    &::after
                        content: ''
                        position: absolute
                        bottom: 0
                        height: 1rem
                        width: 1rem
                        background: transparent
                        z-index: 1
                        opacity: 0
                        user-select: none
                        pointer-events: none

                    &::before
                        right: 100%
                        border-bottom-right-radius: var(--radius-m)
                        box-shadow: .25rem .25rem 0 0 var(--color-background)

                    &::after
                        left: 100%
                        border-bottom-left-radius: var(--radius-m)
                        box-shadow: -.25rem .25rem 0 0 var(--color-background)

                    &:hover,
                    &:focus
                        outline: none
                        color: var(--color-text)
                        background: rgb(255, 255, 255, .5)

                    &.is-active
                        border-radius: var(--radius-m) var(--radius-m) 0 0
                        background: var(--color-background)
                        color: var(--color-text)
                        z-index: 1

                        &::before,
                        &::after
                            opacity: 1

            .styling-panel
                display: flex
                align-items: stretch
                padding: .5rem 0
                height: 5.5rem
                background: var(--color-background)
                border-right: 1px solid var(--color-background-soft)
                border-left: 1px solid var(--color-background-soft)
                border-bottom: 1px solid var(--color-background-soft)
                overflow-x: auto
                overflow-y: hidden

                > hr
                    margin: 0

                .group
                    display: flex
                    align-items: center
                    flex-wrap: wrap
                    padding: 0 1rem
                    gap: .5rem 0



        .editor-content
            width: 100%
            flex: 1
            display: flex
            flex-direction: column
            border-bottom-left-radius: inherit
            border-bottom-right-radius: inherit
            padding: 1rem

            .editor-limiter
                flex: 1
                display: flex
                flex-direction: column
                width: 100%
                max-width: 700px
                margin: 0 auto
                outline: none
                background: var(--color-background)
                border-radius: var(--radius-m)
                box-shadow: var(--shadow-elevation-low)

                &.ignore-limiter
                    max-width: none
</style>