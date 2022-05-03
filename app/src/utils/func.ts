/*
 * @Descripttion: 公共函数库
 * @version: 
 * @Author: yinbiao
 * @Date: 2022-05-02 10:20:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2022-05-02 10:35:57
 */

export function getNameFromOptions(id: number, options: API.BaseOptionsItem[]): string {
    for(let item of options) {
        if(item.id == id) {
            return item.name;
        }
    }
    return "";
}
