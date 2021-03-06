package com.yotta.harvestmark.ptipoc;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.yotta.harvestmark.ptipoc.reactmodules.LabelViewManager;
import com.yotta.harvestmark.ptipoc.reactmodules.ZebraPrint;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by Kumar M on 28-Nov-17.
 */

public class MyReactPackage implements ReactPackage
{
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext)
    {
        List<NativeModule> nativeModuleList = new ArrayList<>();
        nativeModuleList.add(new ZebraPrint(reactContext));
        nativeModuleList.add(LabelViewManager.GET_INSTANCE(reactContext));
        return nativeModuleList;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext)
    {
        return new ArrayList<>(0);
    }
}
