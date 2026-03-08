import {customAlphabet} from 'nanoid'
import User from '../models/User'

const generateCode = customAlphabet('012345678','')

const generateUniqueConnectCode = async () => {
    let code, exists;
    do {
        code = generateCode()
        exists = await User.exists({connectCode: code})
    }
    while (exists);
    return code;
}

export default generateUniqueConnectCode