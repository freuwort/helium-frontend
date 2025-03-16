<template>
    <div class="flex gap-4">
        <LayerPanel :editor="editor"/>
        <div class="flex-1 flex flex-col gap-4 p-4 rounded-xl border bg-slate-50">
            <IodInput type="text" label="Element ID" v-model="eID" />
            <IodInput type="text" label="Element Name" v-model="selected.elementName" />
            <div class="flex gap-4">
                <IodButton class="flex-1" type="button" label="Select self" @click="selectSelf()"/>
                <IodButton class="flex-1" type="button" label="Select parent" @click="selectParent()"/>
                <IodButton class="flex-1" type="button" label="Deselect" @click="deselect()"/>
            </div>
                
            <div class="flex gap-4">
                <IodButton class="flex-1" type="button" label="Insert into" @click="editor.insertElementInto( editor.newElement('div'), eID, 'slot')"/>
                <IodButton class="flex-1" type="button" label="Insert before" @click="editor.insertElementBefore( editor.newElement('div'), eID)"/>
                <IodButton class="flex-1" type="button" label="Insert after" @click="editor.insertElementAfter( editor.newElement('div'), eID)"/>
            </div>
    
            <hr>
            <pre class="text-xs" v-html="JSON.stringify(editor.content, null, 2)"></pre>
            <hr>
            <pre class="text-xs" v-html="JSON.stringify(editor.index, null, 2)"></pre>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import LayerPanel from './LayerPanel.vue'

    type StringKeyObject = {
        [key: string|number]: any
    }

    type EditorConfig = {
        properties: any[]
        elements: any[]
    }

    const eID = ref('')
    const selected = ref<StringKeyObject>({})

    function selectParent() {
        selected.value = editor.value.getElementParent(eID.value) || {}
    }

    function selectSelf() {
        selected.value = editor.value.getElement(eID.value) || {}
    }

    function deselect() {
        selected.value = {}
    }



    const props = defineProps({
        content: {
            required: true,
            type: Array as PropType<any[]>,
        },
        width: {
            required: true,
            type: Number,
        },
        height: {
            required: true,
            type: Number,
        },
    })



    class Utils {
        static uuid(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0
                const v = c === 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
        }
        static newElement(type?: string): Object {
            return {
                elementId: this.uuid(),
                elementName: 'Element',
                elementType: type || 'div',
                position: 'fixed',
                zIndex: 1,
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%',
            }
        }
    }

    class Validators {
        static defined(value: any): any {
            if (value === undefined) throw new Error('Value not defined')
            return value
        }

        static boolean(value: any): boolean {
            Validators.defined(value)

            if ([true, 'true', 'yes', 1, '1'].includes(value)) return true
            if ([false, 'false', 'no', 0, '0'].includes(value)) return false
    
            throw new Error('Invalid boolean value')
        }

        static int(value: any, min?: Number, max?: Number): Number {
            Validators.defined(value)

            try {
                value = parseInt(value)
                if (min && value < min) throw new Error('Value too small')
                if (max && value > max) throw new Error('Value too big')
                return value
            } catch (error) {
                throw error
            }
        }

        static float(value: any, min?: Number, max?: Number): Number {
            Validators.defined(value)

            try {
                value = parseFloat(value)
                if (min && value < min) throw new Error('Value too small')
                if (max && value > max) throw new Error('Value too big')
                return value
            } catch (error) {
                throw error
            }
        }

        static string(value: any, min?: Number, max?: Number): string {
            Validators.defined(value)

            try {
                value = String(value)
                if (min && value.length < min) throw new Error('String too short')
                if (max && value.length > max) throw new Error('String too long')
                return value
            }
            catch (error) {
                throw error
            }
        }

        static uuid(value: any): string {
            Validators.defined(value)

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            
            if (typeof value === 'string' && uuidRegex.test(value)) {
                return value
            }

            throw new Error('Invalid UUID')
        }

        static enum(value: any, values: any[]): any {
            Validators.defined(value)

            if (values.includes(value)) {
                return value
            }

            throw new Error('Invalid value')
        }

        static unit(value: any): string {
            Validators.defined(value)

            try {
                value = String(value)
                const match = value.match(/^\s*(\d+(\.\d+)?)(px|em|rem|%|vh|vw|vmin|vmax)?\s*$/i)
                if (!match) throw new Error('Invalid unit value')
                let [_, numericPart, decimalPart, unit] = match
                if (!unit) throw new Error('Invalid unit value')
                return `${numericPart}${decimalPart || ''}${unit}`
            } catch (error) {
                throw new Error(`Invalid unit value: ${value}`)
            }
        }
    }

    class Property {
        name: string = ''
        type: string = ''
        editable: boolean = false
        validator: Function = () => {}
        default: any = null
        parameters: any[] = []

        constructor(config: any) {
            this.name = config.name
            this.type = config.type
            this.editable = config.editable
            this.validator = config.validator
            this.default = config.default
            this.parameters = config.parameters || []
        }

        defineName(name: string): this {
            this.name = name
            return this
        }

        defineType(type: string): this {
            this.type = type
            return this
        }

        defineEditable(editable: boolean): this {
            this.editable = editable
            return this
        }

        defineValidator(validator: Function): this {
            this.validator = validator
            return this
        }

        defineDefault(defaultVal: any): this {
            this.default = defaultVal
            return this
        }

        defineParameters(parameters: any[]): this {
            this.parameters = parameters || []
            return this
        }

        getDefault() {
            return typeof this.default === 'function' ? this.default() : this.default
        }
        
        validateWithFallback(value: any): any {
            try {
                return this.validator(value, ...this.parameters)
            } catch (error) {
                return this.getDefault()
            }
        }
    }

    class Element {
        type: string = ''
        requiredProps: string[] = []
        definedProps: string[] = []
        definedSlots: string[] = []

        constructor(config: any) {
            this.type = config.type
            this.defineProperties(config.props)
            this.defineSlots(config.slots)
        }

        private defineProperties(properties: string[]): this {
            for (let property of properties) {
                property.startsWith('!')
                    ? this.requiredProps.push(property.slice(1))
                    : this.definedProps.push(property)
            }
            return this
        }

        private defineSlots(slots: string[]): this {
            this.definedSlots = slots
            return this
        }
    }

    class Editor {
        prototypeProperties: StringKeyObject = {}
        prototypeElements: StringKeyObject = {}

        systemProperties = {
            identifierKey: '',
            nameKey: '',
            typeKey: '',
        }

        content: StringKeyObject[] = []
        index: StringKeyObject = {}
        selection = {
            ids: [] as string[],
            anchor: null as string|null,
        }
        
        // Initializations
        configure(config: EditorConfig): void {
            this.defineProperties(config.properties)
            this.defineElements(config.elements)
            this.indexSystemProperties()
        }

        defineProperties(properties: any[]): void {
            this.prototypeProperties = {}
            for (const property of properties) {
                this.prototypeProperties[property.name] = new Property(property)
            }
        }

        defineElements(elements: any[]): void {
            this.prototypeElements = {}
            for (const element of elements) {
                this.prototypeElements[element.type] = new Element(element)
            }
        }
        
        indexSystemProperties(): void {
            this.systemProperties.identifierKey = this.getPrototypePropertyByType('identifier').name as string
            this.systemProperties.nameKey = this.getPrototypePropertyByType('name').name as string
            this.systemProperties.typeKey = this.getPrototypePropertyByType('type').name as string
        }

        
        // Element prototypes
        getPrototypeElement(key: string): Element {
            if (this.prototypeElements[key] === undefined) throw new Error(`Element "${key}" not found`)
            return this.prototypeElements[key]
        }

        prototypeElementExists(key: string): boolean {
            return this.prototypeElements[key] !== undefined
        }

        newElement(type: string, content: StringKeyObject = {}): StringKeyObject {
            if (!this.prototypeElementExists(type)) throw new Error(`Element "${type}" not found`)

            let element = {
                id: null as string | null,
                name: null as string | null,
                type: null as string | null,
                properties: {} as StringKeyObject,
                slots: {} as StringKeyObject,
            }
            let prototype = this.getPrototypeElement(type)

            // Add required properties
            for (const key of prototype.requiredProps) {
                if (!this.prototypePropertyExists(key)) continue
                
                element.properties[key] = this
                    .getPrototypeProperty(key)
                    .validateWithFallback(content[key])
            }

            // Add optional properties
            for (const key of prototype.definedProps) {
                if (content[key] === undefined) continue
                if (!this.prototypePropertyExists(key)) continue
                
                element.properties[key] = this
                    .getPrototypeProperty(key)
                    .validateWithFallback(content[key])
            }

            // Add slots
            for (const key of prototype.definedSlots) {
                element.slots[key] = ['']
            }

            // Set system properties
            element.type = type
            element.id = this.getPrototypeProperty(this.systemProperties.identifierKey).validateWithFallback(content[this.systemProperties.identifierKey])
            element.name = this.getPrototypeProperty(this.systemProperties.nameKey).validateWithFallback(content[this.systemProperties.nameKey])

            return element
        }

        
        // Property prototypes
        getPrototypeProperty(key: string): Property {
            if (this.prototypeProperties[key] === undefined) throw new Error(`Property "${key}" not found`)
            return this.prototypeProperties[key]
        }

        prototypePropertyExists(key: string): boolean {
            return this.prototypeProperties[key] !== undefined
        }

        getPrototypePropertyByType(type: string): Property {
            for (const key in this.prototypeProperties) {
                if (this.prototypeProperties[key].type === type) return this.prototypeProperties[key]
            }

            throw new Error(`Property with type "${type}" not found`)
        }


        // Content
        setContent(rawContent: StringKeyObject[]): void {
            this.content = this.parseContent(rawContent)
            this.index = this.indexContent(this.content)
        }
        
        parseContent(rawContent: StringKeyObject[]) {
            let elements: StringKeyObject[] = []
    
            for (const rawElement of rawContent) {
                let type = rawElement[this.systemProperties.typeKey]

                if (!this.prototypeElementExists(type)) continue

                let prototype = this.getPrototypeElement(type)
                let element = this.newElement(type, rawElement)

                // Fill slots with content
                for (const key of prototype.definedSlots) {
                    element.slots[key] = this.parseContent(Array.isArray(rawElement[key]) ? rawElement[key] : [])
                }
    
                elements.push(element)
            }
    
            return elements
        }

        indexContent(content: StringKeyObject[], path: string[] = []): StringKeyObject {
            let indexed: StringKeyObject = {}

            for (const index in content) {
                const element = content[index]

                indexed[element.id] = {
                    element,
                    path: [...path, index]
                }

                for (const slot in element.slots) {
                    indexed = {
                        ...indexed,
                        ...this.indexContent(element.slots[slot], [...path, index, slot]),
                    }
                }
            }

            return indexed
        }

        getElement(id: string): StringKeyObject | null {
            return this.index[id]?.element || null
        }

        getElementPath(id: string): (string | number)[] | null {
            return this.index[id]?.path || null
        }

        getElementByPath(path: (string | number)[]): StringKeyObject | null {
            let element: any = this.content

            for (const index of path) {
                element = element[index]
            }

            return element
        }

        getElementParent(id: string): StringKeyObject | null {
            let path = this.getElementPath(id)
            if (!path) return null

            path.slice(0, -2)
            if (path.length <= 1) return this.content

            return this.getElementByPath(path)
        }

        private _insertElement(
            element: StringKeyObject,
            anchor: string,
            position: 'before' | 'after'
        ) {
            let path = this.getElementPath(anchor)
            if (!path) return

            let parentElement = this.getElementParent(anchor)
            if (!parentElement) return

            let index = path.pop() as number
            let slot = path.pop() as string
            let shift = position === 'after' ? 1 : 0

            // At non-root level
            if (slot) {
                parentElement.slots[slot].splice(index + shift, shift, element)
                return
            }

            // At root level
            parentElement.splice(index + shift, shift, element)
            return
        }

        insertElementInto(
            element: StringKeyObject,
            anchor: string|null,
            slot: string
        ) {
            // At root level
            if (!anchor) {
                this.content.push(element)
                return
            }

            let anchorElement = this.getElement(anchor)
            if (!anchorElement) return
            
            // At non-root level
            anchorElement.slots[slot].push(element)
        }

        insertElementBefore(
            element: StringKeyObject,
            anchor: string
        ) {
            this._insertElement(element, anchor, 'before')
        }

        insertElementAfter(
            element: StringKeyObject,
            anchor: string
        ) {
            this._insertElement(element, anchor, 'after')
        }
    }



    const editor = ref(new Editor())

    editor.value.configure({
        properties: [
            // System properties
            { name: 'elementId', type: 'identifier', editable: true, validator: Validators.uuid, default: Utils.uuid, },
            { name: 'elementName', type: 'name', editable: true, validator: Validators.string, default: 'Element', },
            { name: 'elementType', type: 'type', editable: false, validator: Validators.string, default: null, },
        
            // Style properties
            { name: 'position', type: 'styleProp', editable: true, validator: Validators.enum, default: 'fixed', parameters: [['fixed', 'absolute']], },
            { name: 'zIndex', type: 'styleProp', editable: true, validator: Validators.int, default: 1, },
            { name: 'top', type: 'styleProp', editable: true, validator: Validators.unit, default: '0px', },
            { name: 'left', type: 'styleProp', editable: true, validator: Validators.unit, default: '0px', },
            { name: 'width', type: 'styleProp', editable: true, validator: Validators.unit, default: '100px', },
            { name: 'height', type: 'styleProp', editable: true, validator: Validators.unit, default: '100px', },
            { name: 'innerText', type: 'styleProp', editable: true, validator: Validators.string, default: '', },
            { name: 'backgroundColor', type: 'styleProp', editable: true, validator: Validators.string, default: 'transparent', },
            { name: 'backgroundImage', type: 'styleProp', editable: true, validator: Validators.string, default: '', },
            { name: 'backgroundSize', type: 'styleProp', editable: true, validator: Validators.string, default: '', },
            { name: 'backgroundPosition', type: 'styleProp', editable: true, validator: Validators.string, default: '', },
            { name: 'backgroundRepeat', type: 'styleProp', editable: true, validator: Validators.enum, default: 'repeat', parameters: [['repeat', 'repeat-x', 'repeat-y', 'no-repeat']], },
            { name: 'color', type: 'styleProp', editable: true, validator: Validators.string, default: 'black', },
            { name: 'fontSize', type: 'styleProp', editable: true, validator: Validators.unit, default: '16px', },
            { name: 'fontFamily', type: 'styleProp', editable: true, validator: Validators.string, default: 'Arial, sans-serif', },
            { name: 'fontWeight', type: 'styleProp', editable: true, validator: Validators.string, default: '400', },
            { name: 'textAlign', type: 'styleProp', editable: true, validator: Validators.enum, default: 'left', parameters: [['left', 'center', 'right', 'justify']], },
        
            // Attributes
            { name: 'src', type: 'attribute', editable: true, validator: Validators.string, default: '', },
            { name: 'alt', type: 'attribute', editable: true, validator: Validators.string, default: '', },
            { name: 'title', type: 'attribute', editable: true, validator: Validators.string, default: '', },
        ],
        elements: [
            {
                type: 'div',
                slots: ['slot'],
                props: ['!position', '!zIndex', '!top', '!left', '!width', '!height', 'innerText', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'color', 'fontSize', 'fontFamily', 'fontWeight', 'textAlign'],
            },
            {
                type: 'span',
                slots: ['slot'],
                props: ['!position', '!zIndex', '!top', '!left', '!width', '!height', 'innerText', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'color', 'fontSize', 'fontFamily', 'fontWeight', 'textAlign'],
            },
            {
                type: 'img',
                slots: [],
                props: ['!position', '!zIndex', '!top', '!left', '!width', '!height', 'src', 'alt', 'title'],
            },
        ],
    })

    editor.value.setContent(props.content)
</script>

<style lang="sass" scoped>
</style>