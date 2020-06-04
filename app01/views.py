from django.shortcuts import render
from scipy.sparse.csgraph import minimum_spanning_tree
from copy import deepcopy
from collections import OrderedDict
import numpy as np
import networkx as nx
try:
    import pygraphviz
    from networkx.drawing.nx_agraph import graphviz_layout
except ImportError:
    try:
        import pydot
        from networkx.drawing.nx_pydot import graphviz_layout
    except ImportError:
        raise ImportError("This example needs Graphviz and either "
                          "PyGraphviz or pydot")

import re
import pandas as pd

from django.http import JsonResponse
# Create your views here.
def fun(request):
    if request.method =='GET':
        return render(request,template_name='home.html')
    else:

        file = request.FILES.get('file')
        if file:

            with open('ffff','wb',)as ffff:
                for i in file.chunks():
                    ffff.write(i)
            sum,lst,title,haplotype,species = fun1('ffff')
            lines,tree,k,gap= calculate(haplotype)
            df = pd.DataFrame(lst)
            df.insert(0, 'data', pd.Series(species))
            df.loc['title'] = pd.Series(title)

            dataset = df.to_numpy().tolist()
            dataset[0], dataset[-1] = dataset[-1], dataset[0]
            dataset[0][0] = 'TraitLabels'
            dataset = {
                'source': dataset
            }
            edges = [i[0] for i in k]

            G = nx.Graph()

            G.add_edges_from(edges)
            # nx.rescale_layout()

            pos = graphviz_layout(G, prog='neato')
            # nx.draw_kamada_kawai(G)
            data_pos = []
            for i in range(len(pos.keys())):
                val = pos.get(i)
                data_pos.append(val)

            # data_pos = [i for i in pos.values()]
            data_pos = [[(i[0] * 3 + 300), i[1] * 2 + 300] for i in data_pos]

            radius = [max(i**0.5,15) for i in sum]

            return JsonResponse({
            'data_pos':data_pos,
            'radius':radius,
            'lines':lines,
            'dataset':dataset,
            'sum':sum,
            'title':title,
            'gap':gap
        })
        else:
            return (JsonResponse('0'))


def fun1(filename):
    #读取文件
    with open(filename,'r',encoding='utf-8')as f:
        a = f.read()
    # 正则匹配序列矩阵
    s1 = re.findall(r'BEGIN CHARACTERS;[\s\S]*?END',a)[0]
    aaa = re.findall(r'MATRIX[\s\S]*?;',s1)
    bbb = aaa[0].split('\n')
    del bbb[0]
    del bbb[-1]

    kkk = OrderedDict()
    for i in bbb:
        if i != '':
            i = i.split(' ')
            kkk[i[0]] = i[1]


    name = list(kkk.keys())
    hyplotype = list(kkk.values())
    species = re.findall(r'TraitLabels[\s\S]*?;', a)[0].strip().split()
    species[-1] = species[-1][:-1]
    del species[0]

    s2 = re.findall(r'BEGIN TRAITS;[\s\S]*?END',a)[0]
    aaa2 = re.findall(r'Matrix[\s\S]*?;',s2)
    bbb = aaa2[0].split('\n')
    del bbb[0]
    del bbb[-1]
    kkk = {}
    for i in bbb:
        if i != '':
            i = i.split(' ')
            kkk[i[0]] = i[1]
    lst = []

    for i in range(len(kkk.values())):
        c = list(kkk.values())[i].split(',')
        c = [int(i) for i in c]
        lst.append(c)



    lst = np.array(lst)

    sum = lst.sum(axis=1).tolist()

    return sum,lst.T,name,hyplotype,species
def calculate(lst):
    length = len(lst)
    k = [[0 for i in range(length)] for i in range(length)]
    for i in range(length):
        for j in range(length):

            for kk in range(len(lst[i])):
                if lst[i][kk] != lst[j][kk] :
                    k[i][j] = k[i][j]+1



    Tcsr = minimum_spanning_tree(k)


    k = []
    f = str(Tcsr).split('\n')
    for i in f:
        i = i.strip().split('\t')
        k.append(i)

    def swap(lst):
        a = (lst[1],lst[0])
        return a
    for i in range(len(k)):

        k[i][0] = eval(k[i][0])
        k[i][1] = eval(k[i][1])
        c = []
        c.append(swap(k[i][0]))
        c.append((k[i][1]))
        k.append(c)
    k.sort()
    sss = {}
    for i in k:
        if (i[0][0]) in sss.keys():
            sss[(i[0][0])].append(i[0][1])
            continue

        sss[(i[0][0])] = [i[0][1]]
    ccccc = list(sss.values())
    gap = deepcopy(ccccc)
    num0 = 0

    num = 0
    for i in ccccc:

        num1 = 0

        for j in i:
            gap[num0][num1] = k[num][1]
            num1 += 1
            num += 1
        num0 += 1

    return list(sss.values()),Tcsr,k,gap
