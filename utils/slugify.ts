import { transliterate as tr, slugify } from 'transliteration'

export default function (str: string = ''): string
{
    return slugify(str)
}