<div>
    @isset($jsPath)
        <script>{!! file_get_contents($jsPath) !!}</script>
    @endisset
    @isset($cssPath)
        <style>{!! file_get_contents($cssPath) !!}</style>
    @endisset

    <div
        x-data="LivewireUISlideover()"
        x-init="init()"
        x-show="isEnabled"
        class="fixed inset-0 z-10 overflow-y-auto"
        style="display: none;"
    >

        @for ($i = 0; $i < count($components) + 1; $i++)
            <!-- Slideover template -->
            <div 
                x-show="isEnabled && visibleComponents.length > {{ $i }}" 
                class="fixed inset-0 z-10 overflow-hidden slideover-ui-container"
            >
                <div 
                    x-show="isEnabled && visibleComponents.length > {{ $i }}" 
                    class="absolute inset-0 z-10 bg-gray-500 bg-opacity-75 slideover-ui-background-overlay"

                    x-transition:enter="ease-in-out duration-500" 
                    x-transition:enter-start="opacity-0" 
                    x-transition:enter-end="opacity-100" 
                    x-transition:leave="ease-in-out duration-500"
                    x-transition:leave-start="opacity-100" 
                    x-transition:leave-end="opacity-0"
                    aria-hidden="true" 
                    
                    x-description="Background overlay" 
                ></div>
                
                <div 
                    x-show="isEnabled && visibleComponents.length > {{ $i }}" 
                    class="absolute inset-y-0 right-0 z-10 bg-white slideover-ui-panel"
                    x-bind:class="getComponentAttributeById(getComponentIdByIndex({{ $i }}), 'width')"
                    
                    x-transition:enter="transform transition ease-in-out duration-500" 
                    x-transition:enter-start="translate-x-full" 
                    x-transition:enter-end="translate-x-0"
                    x-transition:leave="transform transition ease-in-out duration-500" 
                    x-transition:leave-start="translate-x-0" 
                    x-transition:leave-end="translate-x-full"

                    x-description=" Slideover panel" 
                >
                    @if (count($components) > $i)
                        @php
                            $componentId = collect($components)->slice($i, 1)->keys()->first();
                            $component = $components[$componentId];
                            $key = $componentId;
                        @endphp
                        
                        <div x-ref="{{ $key }}" wire:key="{{ $key }}">
                            @livewire($component['name'], $component['arguments'], key($key))
                        </div>
                    @endif
                </div>
            </div>
            <!-- Slideover template -->
        @endfor
    
    </div>
</div>
