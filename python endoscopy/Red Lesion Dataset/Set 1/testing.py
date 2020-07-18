# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
from IPython import get_ipython

# %%
import os
import random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
plt.style.use("ggplot")
#get_ipython().run_line_magic('matplotlib', 'inline')
from pymongo import MongoClient
from tqdm import tqdm, tnrange
from itertools import chain
from skimage.io import imread, imshow, imsave, concatenate_images
from skimage.transform import resize
from skimage.morphology import label
from sklearn.model_selection import train_test_split

import tensorflow as tf

from keras.models import Model, load_model
from keras.layers import Input, BatchNormalization, Activation, Dense, Dropout
from keras.layers.core import Lambda, RepeatVector, Reshape
from keras.layers.convolutional import Conv2D, Conv2DTranspose
from keras.layers.pooling import MaxPooling2D, GlobalMaxPool2D
from keras.layers.merge import concatenate, add
from keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from keras.optimizers import Adam
from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img

import cv2 as cv
import sys
email=sys.argv[1]

patient_no = "E:/Studies/Wireless capsule endoscopy for shifa international hospital/python endoscopy/Red Lesion Dataset/Set 1/test_images/"+email  ## yaha folder ka name catch ho ga jis me patient ka data pra ha, tum hr patient ka alg folder rakho gy
#patient_no = "test_images2"
print(patient_no)


# Set some parameters
im_width = 128
im_height = 128
border = 5
""" client = MongoClient('localhost',27017)
print(MongoClient)
db = client.endoscopy
testRecord=db.TestRecord """



def conv2d_block(input_tensor, n_filters, kernel_size = 3, batchnorm = True):
    """Function to add 2 convolutional layers with the parameters passed to it"""
    # first layer
    x = Conv2D(filters = n_filters, kernel_size = (kernel_size, kernel_size),              kernel_initializer = 'he_normal', padding = 'same')(input_tensor)
    if batchnorm:
        x = BatchNormalization()(x)
    x = Activation('relu')(x)
    
    # second layer
    x = Conv2D(filters = n_filters, kernel_size = (kernel_size, kernel_size),              kernel_initializer = 'he_normal', padding = 'same')(x)
    if batchnorm:
        x = BatchNormalization()(x)
    x = Activation('relu')(x)
    
    return x


def get_unet(input_img, n_filters = 16, dropout = 0.1, batchnorm = True):
    """Function to define the UNET Model"""
    # Contracting Path
    c1 = conv2d_block(input_img, n_filters * 1, kernel_size = 3, batchnorm = batchnorm)
    p1 = MaxPooling2D((2, 2))(c1)
    p1 = Dropout(dropout)(p1)
    
    c2 = conv2d_block(p1, n_filters * 2, kernel_size = 3, batchnorm = batchnorm)
    p2 = MaxPooling2D((2, 2))(c2)
    p2 = Dropout(dropout)(p2)
    
    c3 = conv2d_block(p2, n_filters * 4, kernel_size = 3, batchnorm = batchnorm)
    p3 = MaxPooling2D((2, 2))(c3)
    p3 = Dropout(dropout)(p3)
    
    c4 = conv2d_block(p3, n_filters * 8, kernel_size = 3, batchnorm = batchnorm)
    p4 = MaxPooling2D((2, 2))(c4)
    p4 = Dropout(dropout)(p4)
    
    c5 = conv2d_block(p4, n_filters = n_filters * 16, kernel_size = 3, batchnorm = batchnorm)
    
    # Expansive Path
    u6 = Conv2DTranspose(n_filters * 8, (3, 3), strides = (2, 2), padding = 'same')(c5)
    u6 = concatenate([u6, c4])
    u6 = Dropout(dropout)(u6)
    c6 = conv2d_block(u6, n_filters * 8, kernel_size = 3, batchnorm = batchnorm)
    
    u7 = Conv2DTranspose(n_filters * 4, (3, 3), strides = (2, 2), padding = 'same')(c6)
    u7 = concatenate([u7, c3])
    u7 = Dropout(dropout)(u7)
    c7 = conv2d_block(u7, n_filters * 4, kernel_size = 3, batchnorm = batchnorm)
    
    u8 = Conv2DTranspose(n_filters * 2, (3, 3), strides = (2, 2), padding = 'same')(c7)
    u8 = concatenate([u8, c2])
    u8 = Dropout(dropout)(u8)
    c8 = conv2d_block(u8, n_filters * 2, kernel_size = 3, batchnorm = batchnorm)
    
    u9 = Conv2DTranspose(n_filters * 1, (3, 3), strides = (2, 2), padding = 'same')(c8)
    u9 = concatenate([u9, c1])
    u9 = Dropout(dropout)(u9)
    c9 = conv2d_block(u9, n_filters * 1, kernel_size = 3, batchnorm = batchnorm)
    
    outputs = Conv2D(1, (1, 1), activation='sigmoid')(c9)
    model = Model(inputs=[input_img], outputs=[outputs])
    return model

input_img = Input((im_height, im_width, 1), name='img')
model = get_unet(input_img, n_filters=16, dropout=0.05, batchnorm=True)
model.compile(optimizer=Adam(), loss="binary_crossentropy", metrics=["accuracy"])


#model.summary()

#passing test data
ids = next(os.walk(patient_no))[2]
#print("No. of images = ", len(ids))

X = np.zeros((len(ids), im_height, im_width, 1), dtype=np.float32)
Y = np.zeros((len(ids), im_height, im_width, 3), dtype=np.float32)

# tqdm is used to display the progress bar
for n, id_ in tqdm(enumerate(ids), total=len(ids)):
    # Load images
    img = load_img("E:/Studies/Wireless capsule endoscopy for shifa international hospital/python endoscopy/Red Lesion Dataset/Set 1/test_images/"+email+"/"+id_)
    img_arr = img_to_array(img)
    x_img = resize(img_arr, (128, 128, 1),
                   mode='constant', preserve_range=True)
    y_img = resize(img_arr, (128, 128, 3),
                   mode='constant', preserve_range=True)

    # Save images
    X[n] = x_img/255.0
    Y[n] = y_img/255.0
    

test = X
test_rgb = Y


# load the best model
model.load_weights('E:/Studies/Wireless capsule endoscopy for shifa international hospital/python endoscopy/Red Lesion Dataset/Set 1/model-tgs-salt.h5')

preds_test = model.predict(test, verbose=1)

preds_test_t = (preds_test > 0.5).astype(np.uint8)

p = 0
total = int (len(ids))
#print(total, "is of type", type(total))
os.mkdir("E:/Studies/Wireless capsule endoscopy for shifa international hospital/Backend server/endoscopy/assets/"+email+"")
for index in range(total):
    yes = 0
    imsave("E:/Studies/Wireless capsule endoscopy for shifa international hospital/Backend server/endoscopy/assets/"+email+"/image_predicted_"+str(index)+".jpg".format(str(index)), preds_test[index])
    imag = preds_test[index]
    for i in range(128):
        for j in range(128):
            intensity = imag[i, j]
            #print (intensity)
            if intensity >= 0.8:
                yes = yes+1
                
            
   # print (yes)
    if yes > 100:
        status = "lesion"
        p=p+1
        #print (p)
    else:
        status = "No_Lesion"
        
    #print (status)                         #ye status vala veriable ly jao gy
    
    
percnt = p/total
percnt = percnt*100
print (percnt)#ye % nikl ai ha lesion vali images ki, ye variable % vala b ly jana yaha se

""" record={
    'email': str(sys.argv[1]),
    'test_name': "Wireless Capsule Endoscopy",
    'lesionPercentage': percnt
    #'testResult': preds_test
}
result=testRecord.insert_one(record)
if(result.acknowledged):
    print(result) """

####


# %%



# %%


